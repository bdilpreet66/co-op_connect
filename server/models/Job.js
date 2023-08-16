import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    compensationType: {
        type: String,
        enum: ['unpaid', 'paid'],
        required: true
    },
    rateType: {
        type: String,
        enum: ['hourly', 'annual', 'na'],
        required: function() { return this.compensationType === 'paid'; }
    },
    hourlyRate: {
        type: Number,
        required: function() { return this.rateType === 'hourly'; }
    },
    annualRate: {
        type: Number,
        required: function() { return this.rateType === 'annual'; }
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
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    status: {
        type: String,
        enum: ['open', 'closed'],  // Only allow these two values
        required: true,
        default: 'open'  // By default, a job will be set to 'open' when created
    },
    postedDate: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
