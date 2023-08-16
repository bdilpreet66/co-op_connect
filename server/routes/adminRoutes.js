import express from 'express';
import { adminDasboardController } from '../controllers/admin/dashboardControler.js';
import { schoolListController, schoolCreateController, schoolCreateViewController, schoolEditViewController, schoolUpdateController, schoolSubscriptionController, schoolPaymentSuccessController } from "../controllers/admin/schoolControler.js";
import { getUnapprovedUsers, getApprovedUsers, declineUser, approveUser, users, searchUsers, viewProfile  } from '../controllers/admin/userController.js';
import { companyListController, companyViewController } from '../controllers/admin/companyController.js';

const router = express.Router();

router.get('/dashboard', adminDasboardController);
router.get('/schools', schoolListController);
router.get('/schools/add', schoolCreateViewController);
router.post('/schools/add', schoolCreateController);
router.get('/schools/edit/:id', schoolEditViewController);
router.post('/schools/edit/:id', schoolUpdateController);
router.get('/schools/payment/:id', schoolSubscriptionController);
router.get('/schools/payment-success/:id', schoolPaymentSuccessController);
router.get('/users', users);
router.get('/users/unapproved', getUnapprovedUsers);
router.get('/users/approved', getApprovedUsers);
router.delete('/user/decline/:id', declineUser);
router.post('/users/approve/:id', approveUser);
router.get('/users/search', searchUsers);
router.get('/user/:userId/profile', viewProfile);
router.get('/companies', companyListController);
router.get('/companies/view/:id', companyViewController);




export default router;
