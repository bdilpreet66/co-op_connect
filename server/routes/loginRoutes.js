import express from 'express';
import { loginGetController, loginPostController } from '../controllers/loginController.js';
import { signupGetController, signupPostController } from '../controllers/signupController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', loginGetController);
router.post('/login', loginPostController);

router.get('/signup', signupGetController);
router.post('/signup', signupPostController);

export default router;
