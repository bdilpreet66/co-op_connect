import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',  // Reference to the Job model
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    // You can add more fields if needed, like status, resume link, etc.
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
