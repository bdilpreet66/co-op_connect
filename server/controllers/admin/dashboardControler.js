import User from "../../models/User.js";

export const adminDasboardController = async (req, res) => {
    try {
        const users = await User.find({ approved: false });

        res.render('Admin/dashboard', { users: users, activeMenu: 'dashboard' });
    } catch (error) {
        console.error("Error fetching data for company dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};