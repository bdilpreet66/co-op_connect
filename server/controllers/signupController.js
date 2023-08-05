import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signupGetController = (req, res) => {
  res.render('signup');
};

export const signupPostController = async (req, res) => {
  const { c_name, email, password, cpassword } = req.body;
  console.log(req.body)

  try {
    const user = new User({
      c_name,
      email,
      password: password,
      userType: "company"
    });

    await user.save();

    res.redirect('/login');
  } catch (error) {
    res.redirect('/signup');
  }
};
