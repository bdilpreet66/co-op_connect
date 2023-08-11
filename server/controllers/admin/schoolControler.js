import School from "../../models/School.js";
import Stripe from 'stripe';

const stripe = new Stripe('pk_test_mTxUvfPIEY1NmqYYxWXXcj0900NuCD976L');

export const schoolListController = async (req, res) => {
    try {
        let searchQuery = req.query.search || '';
        let schools = await School.find({ name: new RegExp(searchQuery, 'i') });

        res.render('Admin/schoolList', { schools, activeMenu: 'school' });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
};

export const schoolCreateViewController = async (req, res) => {
    try {
        res.render('Admin/schoolAdd', { activeMenu: 'school' });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
};

export const schoolCreateController = async (req, res) => {
    try {
        // Capture form data from req.body
        let newSchool = {
            name: req.body.name,
            domain: req.body.domain,
            contact: req.body.contact,
            subscriptionStatus: 'pending' 
        };

        // Respond with session ID
        res.redirect("/schools/edit/:id");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const schoolEditViewController = async (req, res) => {
    try {
        res.render('Admin/schoolEdit', { activeMenu: 'school' });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
};

// app.get('/payment-success', async (req, res) => {
//     const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
//     const paymentStatus = session.payment_status; // 'paid' if successful

//     if (paymentStatus === 'paid') {
//         // Update the school subscription status
//         await School.findByIdAndUpdate(schoolId, { subscriptionStatus: 'active' });
//     }
//     // Handle other cases as needed...

//     res.redirect('/listSchools');
// });





