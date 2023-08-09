import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    workSetup: {
        type: String,
        enum: ['Hybrid', 'Remote', 'In-Office'],
        required: true
    },
    jobLocation: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    status: {
        type: String,
        enum: ['open', 'closed'],  // Only allow these two values
        required: true,
        default: 'open'  // By default, a job will be set to 'open' when created
    }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
