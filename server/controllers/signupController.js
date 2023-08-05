import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signupGetController = (req, res) => {
  res.render('signup');
};

export const signupPostController = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      userType
    });

    await user.save();

    res.redirect('/login');
  } catch (error) {
    res.redirect('/signup');
  }
};
