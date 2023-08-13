import Event from '../../models/Event.js';  // Adjust this import path accordingly

export const listEventsController = async (req, res) => {
    try {
        const { page = 1, search = '' } = req.query;  // Extract page and search query parameters

        const limit = 10;  // Or however many items you want per page
        const skip = (Number(page) - 1) * limit;  // Calculate the offset

        // Find events based on the search query, paginated
        const events = await Event.find({
            // Assuming you want to search by name of the event
            name: { $regex: new RegExp(search, 'i') }, 
        })
        .limit(limit)
        .skip(skip)
        .exec();

        res.status(200).json(events);

    } catch (error) {
        console.error("Error fetching events: ", error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
