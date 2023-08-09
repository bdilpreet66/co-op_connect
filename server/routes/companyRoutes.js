import express from 'express';
import { companyDasboardController } from '../controllers/company/dashboardControler.js';
import { addEvent, saveEvent, getAllEvents, getEditEvent, postEditEvent, deleteEvent  } from '../controllers/company/eventController.js';
import { getEditCompany, postEditCompany  } from '../controllers/company/companyController.js';
import { getAddJob, postAddJob, getJobs, getEditJob, postEditJob, getCandidatesForJob } from '../controllers/company/jobController.js';

const router = express.Router();

router.get('/dashboard', companyDasboardController);
router.get('/addEvent', addEvent);
router.post('/saveEvent', saveEvent);
router.get('/events', getAllEvents);
router.get('/event/edit/:id', getEditEvent);
router.post('/event/edit/:id', postEditEvent);
router.delete('/event/delete/:id', deleteEvent);
router.get('/company/edit/:id', getEditCompany);
router.post('/company/edit/:id', postEditCompany);
router.get('/addJob', getAddJob);
router.post('/saveJob', postAddJob);
router.get('/jobs', getJobs);
router.get('/job/edit/:id', getEditJob);
router.post('/job/edit/:id', postEditJob);
router.get('/job/:jobId/candidates', getCandidatesForJob);




export default router;