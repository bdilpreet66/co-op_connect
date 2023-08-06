import Event from '../../models/Event.js';

export const getEvent = (req, res) => {
    res.render('event');
};

export const postEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.redirect('/events'); // Redirect to a list of events or some other page
    } catch (error) {
        res.render('event', { error: 'Failed to create the event.' });
    }
};
