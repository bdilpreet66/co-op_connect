import express from 'express';
import { createUser, searchUsers, validateLogin } from '../controllers/API/userController.js';
import { createResume, getResume } from '../controllers/API/resumeController.js';
import { listEventsController } from '../controllers/API/eventsController.js'

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:email', searchUsers);
router.post('/users/validate', validateLogin);
router.post('/resume', createResume);
router.get('/resume/:id', getResume);
router.get('/events', listEventsController);

export default router;
