import { prisma } from '../../prisma/client.js';
import { predictComplaint } from '../../services/prediction.service.js';
import { sendComplaintConfirmation } from '../../services/whatsapp.service.js';

function buildComplaintWhere({ search, status, priority, departmentId, citizenId }) {
  const where = {};

  if (status) where.status = String(status).toUpperCase();
  if (priority) where.priority = String(priority).toUpperCase();
  if (departmentId) where.departmentId = departmentId;
  if (citizenId) where.citizenId = citizenId;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

export async function createComplaint(data, actorId, options = {}) {
  const prediction = await predictComplaint(data.description);
  const modelPriority = prediction.priority ? String(prediction.priority).toUpperCase() : null;
  const complaintPriority = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(modelPriority)
    ? modelPriority
    : String(data.priority || 'MEDIUM').toUpperCase();

  const complaint = await prisma.complaint.create({
    data: {
      title: data.title,
      description: data.description,
      priority: complaintPriority,
      departmentId: data.departmentId || null,
      citizenId: actorId,
      assignedOfficerId: data.assignedOfficerId || null,
    },
  });
  let savedPrediction = null;

  if (!prediction.unavailable) {
    savedPrediction = await prisma.prediction.create({
      data: {
        complaintId: complaint.id,
        category: data.category || data.subCategory || 'General',
        confidenceScore: prediction.validity_confidence,
        validity: prediction.validity,
        validityConfidence: prediction.validity_confidence,
        priority: prediction.priority,
        priorityConfidence: prediction.priority_confidence,
        trustScore: prediction.trust_score,
      },
    });
  }

  await prisma.complaintStatusHistory.create({
    data: {
      complaintId: complaint.id,
      oldStatus: null,
      newStatus: complaint.status,
      changedById: actorId,
      note: 'Complaint submitted',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: actorId,
      action: 'COMPLAINT_CREATED',
      entityType: 'Complaint',
      entityId: complaint.id,
      meta: { title: complaint.title, source: data.source || 'portal' },
    },
  });

  const result = {
    ...complaint,
    prediction: savedPrediction
      ? {
          complaint: data.description,
          validity: savedPrediction.validity,
          validity_confidence: Number(savedPrediction.validityConfidence),
          priority: savedPrediction.priority,
          priority_confidence: Number(savedPrediction.priorityConfidence),
          trust_score: Number(savedPrediction.trustScore),
        }
      : prediction,
  };

  let whatsappNotification = { sent: false, reason: 'WhatsApp notification disabled for this source' };

  if (options.notifyWhatsApp !== false) {
    const user = await prisma.user.findUnique({ where: { id: actorId } });
    if (user?.phone) {
      const notification = await sendComplaintConfirmation({
        user,
        complaint: result,
        prediction: result.prediction,
      }).catch((error) => ({ sent: false, reason: error.message }));
      whatsappNotification = notification;

      await prisma.activityLog.create({
        data: {
          userId: actorId,
          action: notification.sent ? 'WHATSAPP_CONFIRMATION_SENT' : 'WHATSAPP_CONFIRMATION_SKIPPED',
          entityType: 'Complaint',
          entityId: result.id,
          meta: notification,
        },
      });
    } else {
      whatsappNotification = { sent: false, reason: 'Profile phone number is not set' };
      await prisma.activityLog.create({
        data: {
          userId: actorId,
          action: 'WHATSAPP_CONFIRMATION_SKIPPED',
          entityType: 'Complaint',
          entityId: result.id,
          meta: whatsappNotification,
        },
      });
    }
  }

  return { ...result, whatsappNotification };
}

export async function listComplaints(query, currentUser) {
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;

  const isCitizen = currentUser?.role === 'citizen';
  const where = buildComplaintWhere({
    search: query.search,
    status: query.status,
    priority: query.priority,
    departmentId: query.departmentId,
    citizenId: isCitizen ? currentUser.id : query.citizenId,
  });

  const [total, complaints] = await prisma.$transaction([
    prisma.complaint.count({ where }),
    prisma.complaint.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        citizen: { select: { id: true, name: true, email: true, role: true } },
        department: true,
        assignedOfficer: { select: { id: true, name: true, email: true, role: true } },
        statusHistory: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    }),
  ]);

  return {
    items: complaints,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
}

export async function getComplaintById(id, currentUser) {
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      citizen: { select: { id: true, name: true, email: true, role: true } },
      department: true,
      assignedOfficer: { select: { id: true, name: true, email: true, role: true } },
      statusHistory: { orderBy: { createdAt: 'desc' } },
      attachments: true,
      feedback: true,
      predictions: true,
      incidents: true,
    },
  });

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  if (currentUser?.role === 'citizen' && complaint.citizenId !== currentUser.id) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  return complaint;
}

export async function updateComplaint(id, data, currentUser) {
  const existing = await prisma.complaint.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  if (currentUser?.role === 'citizen' && existing.citizenId !== currentUser.id) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  const nextStatus = data.status ? String(data.status).toUpperCase() : existing.status;
  const nextPriority = data.priority ? String(data.priority).toUpperCase() : existing.priority;
  const statusChanged = nextStatus !== existing.status;

  const updated = await prisma.complaint.update({
    where: { id },
    data: {
      title: data.title ?? existing.title,
      description: data.description ?? existing.description,
      status: nextStatus,
      priority: nextPriority,
      departmentId: data.departmentId ?? existing.departmentId,
      assignedOfficerId: data.assignedOfficerId ?? existing.assignedOfficerId,
    },
  });

  if (statusChanged) {
    await prisma.complaintStatusHistory.create({
      data: {
        complaintId: id,
        oldStatus: existing.status,
        newStatus: nextStatus,
        changedById: currentUser.id,
        note: data.note || 'Status updated',
      },
    });
  }

  await prisma.activityLog.create({
    data: {
      userId: currentUser.id,
      action: 'COMPLAINT_UPDATED',
      entityType: 'Complaint',
      entityId: id,
      meta: data,
    },
  });

  return updated;
}

export async function deleteComplaint(id, currentUser) {
  const existing = await prisma.complaint.findUnique({ where: { id } });
  if (!existing) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  if (currentUser?.role === 'citizen' && existing.citizenId !== currentUser.id) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  await prisma.activityLog.create({
    data: {
      userId: currentUser.id,
      action: 'COMPLAINT_DELETED',
      entityType: 'Complaint',
      entityId: id,
    },
  });

  await prisma.complaint.delete({ where: { id } });

  return { id };
}
