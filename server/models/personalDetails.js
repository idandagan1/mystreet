import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const detailsSchema = new Schema({

    userId: {
        type: ObjectId,
        ref: 'user',
    },
    // Basic info
    firstName: {
        type: String,
    },
    familyName: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    // About
    email: {
        type: String,
    },
    relationship: {
        type: String,
    },
    about: {
        type: String,
    },
    // Professional
    work: {
        type: String,
    },
    skills: [{
        type: String,
    }],
    college: {
        type: String,
    },

}, { collection: 'personalDetails' });

export default mongoose.model('personalDetails', detailsSchema);
