var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({

    _id: {
        type:Schema.Types.ObjectId
    },
    posted: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    text: {
        type: String
    }

}, {collection: 'message'});

module.exports = mongoose.model('message', messageSchema);
