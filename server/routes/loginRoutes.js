import express from 'express';
import { loginGetController, loginPostController, logoutPostController } from '../controllers/loginController.js';
import { signupGetController, signupPostController } from '../controllers/signupController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', loginGetController);
router.post('/login', loginPostController);

router.get('/signup', signupGetController);
router.post('/signup', signupPostController);

router.get('/logout', logoutPostController);

export default router;
