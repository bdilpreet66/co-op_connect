import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
});

const EducationExperienceSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Education', 'Experience'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    institution: {  // This can be a school for 'Education' or company for 'Experience'
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        // Add other fields as required
    },
    skills: [SkillSchema],
    educationExperiences: [EducationExperienceSchema],
});

const Resume = mongoose.model('Resume', ResumeSchema);
export default Resume;