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
            subscriptionStatus: 'pending' 
        };

        // Save the new school to the database
        let school = await School.create(newSchool);

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'School Subscription',
                    },
                    unit_amount: 2000, // e.g., $20.00 USD
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: '/admin/schools/payment_success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: '/admin/schools',
        });

        // Respond with session ID
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
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





