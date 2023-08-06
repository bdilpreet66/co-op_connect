import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dateTime: {
        start: Date,
        end: Date
    },
    description: String,
    linkLocation: String,
    comments: String,
    type: {
        type: String,
        enum: ['in-person', 'live', 'webinar','hackathon'], // Add your event types here
        required: true
    }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;