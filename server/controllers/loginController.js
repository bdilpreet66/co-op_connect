import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const loginGetController = (req, res) => {
    console.log('Login Get');
    res.render('login');
};

export const loginPostController = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
};
