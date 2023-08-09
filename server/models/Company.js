import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    additionalInfo: {
        type: String,
        trim: true
    }
});

const Company = mongoose.model('Company', companySchema);

export default Company;
