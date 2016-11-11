import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const detailsSchema = new Schema({

    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    birthday:{
        type: Date
    },
    relationshipStatus:{
        type: String
    },
    gender:{
        type: String
    },
    job:{
        type: String
    },
    description:{
        type: String
    }

}, { collection: 'personalDetails' });

export default mongoose.model('personalDetails', detailsSchema);
