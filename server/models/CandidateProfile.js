import mongoose from 'mongoose';

const candidateProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true,
        unique: true  // Ensure that one user can have only one profile
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    skills: [{
        type: String  // Array of skills
    }],
    // You can add more fields if needed, like graduation year, GPA, etc.
});

const CandidateProfile = mongoose.model('CandidateProfile', candidateProfileSchema);
export default CandidateProfile;