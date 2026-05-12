import { asyncHandler } from '../../utils/asyncHandler.js';
import { handleIncomingWhatsApp } from './whatsapp.service.js';

export const webhookHandler = asyncHandler(async (req, res) => {
  const xml = await handleIncomingWhatsApp({
    from: req.body.From,
    body: req.body.Body,
  });

  res.type('text/xml').send(xml);
});
