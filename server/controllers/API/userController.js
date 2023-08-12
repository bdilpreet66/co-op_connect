import User from '../../models/User.js';
import School from '../../models/School.js';

export const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const { email, ...otherData } = req.body;

        // Extract domain from email
        const emailDomain = email.split('@')[1];

        // Check if the domain exists in the School model
        const school = await School.findOne({ domain: emailDomain });

        let approved = false;
        if (school) {
            approved = true;
        }

        // Create user with the `approved` field based on the above check
        const user = new User({
            email,
            approved,
            ...otherData
        });
        await user.save();

        res.json(user);
    } catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).send("Internal server error");
    }
};

export const searchUsers = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });
        res.json(user);
    } catch (error) {
        console.error("Error searching users: ", error);
        res.status(500).send("Internal server error");
    }
};

export const validateLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user)
        if (user && (password === user.password)) {
            res.json({ success: true, data: user });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
    } catch (error) {
        console.error("Error validating login: ", error);
        res.status(500).send("Internal server error");
    }
};
