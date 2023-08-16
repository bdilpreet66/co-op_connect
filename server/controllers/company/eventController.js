import Event from '../../models/Event.js';

export const addEvent = (req, res) => {
    res.render('Company/addEvent',{ activeMenu: 'events',companyId: req.session.companyId});
};

export const saveEvent = async (req, res) => {    
    try {        
        const eventData = {
            name: req.body.name,
            start:req.body.start,
            end:req.body.end,
            description: req.body.description,
            linkOrLocation: req.body.linkOrLocation,
            comments: req.body.comments,
            type: req.body.type,
            companyId: req.session.companyId
        };    
        const event = new Event(eventData);        
        await event.save();
        res.redirect('/company/events'); // Redirect to a list of events or some other page        
    } catch (error) {        
        res.status(500).json({ error: 'Failed to create the event.' });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const { companyId } = req.session;
        if (!companyId) {
            throw new Error("Company ID is not set in session.");
        }

        const events = await Event.find({ companyId });

        res.render('company/eventsList', { 
            events, 
            activeMenu: 'events',
            companyId 
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send('Failed to fetch events.');
    }
};

export const getEditEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render('company/editEvent', { event:event, activeMenu: 'events',companyId: req.session.companyId });
    } catch (error) {
        res.status(500).send('Failed to fetch the event.');
    }
};

export const postEditEvent = async (req, res) => {
    try {
        await Event.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/company/events');
    } catch (error) {
        res.status(500).send('Failed to update the event.');
    }
};

export const deleteEvent = async (req, res) => {
    console.log('deleteEvent');
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ success: false });
    }
};
