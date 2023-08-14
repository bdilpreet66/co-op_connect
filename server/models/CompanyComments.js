import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const companyCommentsSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company' // Assuming you have a Company model/schema. This creates a relation to it.
    },
    comment: {
        type: String,
        required: true
    },
    comment_by: {
        type: String,
        required: true
    },
    comment_date: {
        type: Date,
        default: Date.now
    }
});

const CompanyComments = mongoose.model('CompanyComments', companyCommentsSchema);

export default CompanyComments;