import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  domain: {
    type: String,
    required: true,
    unique: true
  },
  subscriptionStatus: {
    type: String, // Can be 'active', 'pending', 'expired', etc.
    required: true,
    default: 'pending'
  },
  stripeLink: { // Store the generated Stripe link for the school
    type: String,
    required: false
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const School = mongoose.model('School', SchoolSchema);
export default School;
