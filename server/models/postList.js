import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postListSchema = new Schema({

    bucket: {
        type: Number,
    },
    count: {
        type: Number,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'post',
    }],
}, { collection: 'postList' });

export default mongoose.model('postList', postListSchema);
