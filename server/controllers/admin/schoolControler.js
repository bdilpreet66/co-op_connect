import School from "../../models/School.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_z4N3EJQQAbAlkUqTb2WM5VPr00Wpt50eRT');

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
    
        const school = new School(newSchool);        
        await school.save();

        // Respond with session ID
        res.redirect("/admin/schools/edit/"+school._id);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const schoolEditViewController = async (req, res) => {
    try {
        const schoolId = req.params.id;
        const school = await School.findById(schoolId);
        
        if (!school) {
            return res.status(404).send('School not found');
        }
        res.render('Admin/schoolEdit', { school, activeMenu: 'school' });
    } catch (error) {
        console.error("Error fetching data", error);
        res.status(500).send("Internal Server Error");
    }
};

export const schoolUpdateController = async (req, res) => {
    try {
        const schoolId = req.params.id;
        const updatedData = {
            name: req.body.name,
            domain: req.body.domain,
            contact: req.body.contact,
        };

        await School.findByIdAndUpdate(schoolId, updatedData);

        res.redirect('/admin/schools'); // Redirect back to the list of schools after updating
    } catch (error) {
        console.error("Error updating school", error);
        res.status(500).send("Internal Server Error");
    }
};

export const schoolSubscriptionController = async (req, res) => {
    try {
        // Capture form data from req.body
        const schoolId = req.params.id;

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
            success_url: 'http://localhost:3000/admin/schools/payment-success/64d6831fceb538809600471f?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/admin/schools',
        });

        // Respond with the Stripe checkout URL
        res.json({ checkoutUrl: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

export const schoolPaymentSuccessController = async (req, res) => {
    try {
        // Capture form data from req.body
        const schoolId = req.params.id;

        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
        const paymentStatus = session.payment_status; // 'paid' if successful

        if (paymentStatus === 'paid') {
            // Update the school subscription status
            await School.findByIdAndUpdate(schoolId, { subscriptionStatus: 'active' });
        }
        // Handle other cases as needed...

        res.render('Admin/paymentSuccess');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}





