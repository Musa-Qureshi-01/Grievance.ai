import { body, param, query } from 'express-validator';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { successResponse } from '../../utils/apiResponse.js';
import { createComplaint, deleteComplaint, getComplaintById, listComplaints, updateComplaint } from './complaint.service.js';

export const createComplaintValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('departmentId').optional().isUUID(),
  body('assignedOfficerId').optional().isUUID(),
];

export const updateComplaintValidation = [
  param('id').isUUID().withMessage('Valid complaint id is required'),
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('status').optional().isIn(['submitted', 'triaged', 'assigned', 'in_progress', 'resolved', 'rejected', 'closed']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('departmentId').optional().isUUID(),
  body('assignedOfficerId').optional().isUUID(),
];

export const getComplaintValidation = [param('id').isUUID().withMessage('Valid complaint id is required')];

export const listComplaintValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

export const createComplaintHandler = asyncHandler(async (req, res) => {
  const complaint = await createComplaint(req.body, req.user.id);
  return successResponse(res, complaint, 'Complaint created', 201);
});

export const listComplaintsHandler = asyncHandler(async (req, res) => {
  const result = await listComplaints(req.query, req.user);
  return successResponse(res, result, 'Complaints loaded');
});

export const getComplaintHandler = asyncHandler(async (req, res) => {
  const complaint = await getComplaintById(req.params.id, req.user);
  return successResponse(res, complaint, 'Complaint loaded');
});

export const updateComplaintHandler = asyncHandler(async (req, res) => {
  const complaint = await updateComplaint(req.params.id, req.body, req.user);
  return successResponse(res, complaint, 'Complaint updated');
});

export const deleteComplaintHandler = asyncHandler(async (req, res) => {
  const result = await deleteComplaint(req.params.id, req.user);
  return successResponse(res, result, 'Complaint deleted');
});
