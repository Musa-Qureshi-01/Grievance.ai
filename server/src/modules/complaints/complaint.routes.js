import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validateRequest.js';
import {
  createComplaintHandler,
  createComplaintValidation,
  deleteComplaintHandler,
  getComplaintHandler,
  getComplaintValidation,
  listComplaintValidation,
  listComplaintsHandler,
  updateComplaintHandler,
  updateComplaintValidation,
} from './complaint.controller.js';

const router = Router();

router.use(authenticateToken);

router.post('/', createComplaintValidation, validateRequest, createComplaintHandler);
router.get('/', listComplaintValidation, validateRequest, listComplaintsHandler);
router.get('/:id', getComplaintValidation, validateRequest, getComplaintHandler);
router.put('/:id', updateComplaintValidation, validateRequest, updateComplaintHandler);
router.delete('/:id', getComplaintValidation, validateRequest, deleteComplaintHandler);

export default router;
