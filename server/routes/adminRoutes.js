import express from 'express';
import { adminDasboardController } from '../controllers/admin/dashboardControler.js';

const router = express.Router();

router.get('/dashboard', adminDasboardController);

export default router;
