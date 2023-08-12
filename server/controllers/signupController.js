import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';

export const signupGetController = (req, res) => {
  res.render('signup');
};

export const signupPostController = async (req, res) => {
  
  const { c_name, email, password, cpassword } = req.body;

  console.log(req.body)

  try {

    const company = new Company({
      name: c_name,
      email: email
    });

    await company.save();

    const user = new User({
      c_name,
      email,
      password: password,
      userType: "company",
      companyId: company._id
    });

    await user.save();

    res.redirect('/login');
  } catch (error) {
    res.redirect('/signup');
  }
};
