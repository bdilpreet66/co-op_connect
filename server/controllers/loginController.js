import User from '../models/User.js';

export const loginGetController = (req, res) => {
    res.render('login');
};

export const loginPostController = async (req, res) => {
    try {
        const { email, password, remember_me } = req.body;
        const user = await User.findOne({ email, password });

        if (user) {
            req.session.userId = user._id;

            if (remember_me) {
                // Extend the session to, e.g., 30 days if "Remember Me" is checked
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            } else {
                // Set the session to expire when the browser closes if "Remember Me" is not checked
                req.session.cookie.expires = false;
            }

            if (user.userType === "company") {
                res.redirect('/company/dashboard');
            } else {
                res.redirect('/admin/dashboard');
            }
        } else {
            console.log("passwords don't match")
            req.flash('error', 'Invalid email or password.');
            res.render('login', { error: 'Invalid email or password.' });
        }
    } catch (error) {
        req.flash('error', 'Something went wrong contact the admin.');
        res.render('login', { error: 'Something went wrong contact the admin.' });
    }
};


