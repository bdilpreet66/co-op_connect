import express from 'express';
import { companyDasboardController } from '../controllers/company/dashboardControler.js';

const router = express.Router();

router.get('/dashboard', companyDasboardController);

export default router;
