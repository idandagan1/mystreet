import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const businessSchema = new Schema({

    businessName:{
        type: String
    },
    plan:{
      type: Number
    },
    location: {
        type: [Number],
        index: '2dsphere'
    },
    phone:{
        type:String
    },
    owner:{
        type: ObjectId,
        ref: 'street'
    }


}, { collection: 'businessSchema' });

export default mongoose.model('businessSchema', businessSchema);
