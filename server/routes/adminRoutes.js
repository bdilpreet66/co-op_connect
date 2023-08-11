import express from 'express';
import { adminDasboardController } from '../controllers/admin/dashboardControler.js';
import { schoolListController, schoolCreateController, schoolCreateViewController } from "../controllers/admin/schoolControler.js";

const router = express.Router();

router.get('/dashboard', adminDasboardController);
router.get('/schools', schoolListController);
router.get('/schools/add', schoolCreateViewController);
router.post('/schools/add', schoolCreateController);

export default router;
