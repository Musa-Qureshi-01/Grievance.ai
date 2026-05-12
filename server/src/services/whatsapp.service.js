import twilio from 'twilio';

function normalizeWhatsAppNumber(phone) {
  if (!phone) return null;
  const raw = String(phone).trim();
  if (raw.startsWith('whatsapp:')) return raw;
  const digits = raw.replace(/[^\d+]/g, '');
  if (!digits) return null;
  return `whatsapp:${digits.startsWith('+') ? digits : `+${digits}`}`;
}

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !from) {
    return null;
  }

  return {
    client: twilio(accountSid, authToken),
    from,
  };
}

export async function sendWhatsAppMessage(toPhone, body) {
  const config = getTwilioClient();
  const to = normalizeWhatsAppNumber(toPhone);

  if (!config || !to) {
    return { sent: false, reason: 'Twilio WhatsApp is not configured or user phone is missing' };
  }

  const message = await config.client.messages.create({
    from: config.from,
    to,
    body,
  });

  return { sent: true, sid: message.sid };
}

export async function sendComplaintConfirmation({ user, complaint, prediction }) {
  const priority = prediction?.priority || complaint.priority || 'Pending';
  const body = [
    `Hello ${user.name || 'Citizen'},`,
    '',
    'Your complaint has been submitted successfully.',
    '',
    `Tracking ID: ${complaint.id}`,
    `Title: ${complaint.title}`,
    `Priority: ${priority}`,
    `Status: ${complaint.status}`,
    '',
    'You can track updates from the Citizen Portal.',
  ].join('\n');

  return sendWhatsAppMessage(user.phone, body);
}

export function twilioTextResponse(message) {
  const response = new twilio.twiml.MessagingResponse();
  response.message(message);
  return response.toString();
}

export function normalizePhoneForUser(from) {
  const normalized = normalizeWhatsAppNumber(from);
  return normalized?.replace('whatsapp:', '') || null;
}
