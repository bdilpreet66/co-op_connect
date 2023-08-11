import express from 'express';
import { adminDasboardController } from '../controllers/admin/dashboardControler.js';
import { schoolListController, schoolCreateController, schoolCreateViewController, schoolEditViewController, schoolUpdateController, schoolSubscriptionController, schoolPaymentSuccessController } from "../controllers/admin/schoolControler.js";

const router = express.Router();

router.get('/dashboard', adminDasboardController);
router.get('/schools', schoolListController);
router.get('/schools/add', schoolCreateViewController);
router.post('/schools/add', schoolCreateController);
router.get('/schools/edit/:id', schoolEditViewController);
router.post('/schools/edit/:id', schoolUpdateController);
router.get('/schools/payment/:id', schoolSubscriptionController);
router.get('/schools/payment-success/:id', schoolPaymentSuccessController);

export default router;
