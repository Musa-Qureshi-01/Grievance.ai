import express, { Router } from 'express';


const complaintRouter = Router();

complaintRouter.post('/create', createComplaint);
complaintRouter.put('/update/:id', updateComplaint);
complaintRouter.get('/get-all', getAllComplaints);
complaintRouter.get('/get/:id', getComplaintById);