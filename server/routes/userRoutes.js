import express from 'express';
import { createUser, searchUsers, validateLogin } from '../controllers/API/userController.js';
import { createResume, getResume } from '../controllers/API/resumeController.js';
import { listEventsController } from '../controllers/API/eventsController.js'
import { listCompaniesController, getCompanyController, addCommentController, getAllCommentsController, getChatController } from '../controllers/API/companyController.js';
import { applyForJob, fetchMatchingJobs, getApplicationStatus } from '../controllers/API/jobController.js';

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:email', searchUsers);
router.post('/users/validate', validateLogin);
router.post('/resume', createResume);
router.get('/resume/:id', getResume);
router.get('/events', listEventsController);
router.get('/companies', listCompaniesController);
router.get('/company', getCompanyController);
router.post('/company/comment', addCommentController);
router.get('/company/:companyId/comments', getAllCommentsController);
router.get('/chat/:companyId/:userId', getChatController);
router.get('/jobs', fetchMatchingJobs);
router.post('/apply', applyForJob);
router.get('/status/:jobId/:userId', getApplicationStatus);

export default router;
