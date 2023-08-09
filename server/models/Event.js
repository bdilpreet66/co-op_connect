import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    description: String,
    linkOrLocation: String,
    comments: String,
    type: {
        type: String,
        enum: ['in-person', 'live', 'webinar','hackathon'], // Add your event types here
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;