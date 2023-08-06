import express from 'express';
import { companyDasboardController } from '../controllers/company/dashboardControler.js';
import { getEvent, postEvent } from '../controllers/company/eventController.js';

const router = express.Router();

router.get('/dashboard', companyDasboardController);
router.get('/event', getEvent);
router.post('/event', postEvent);

export default router;