var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Message = new Schema({

    _id: { type:Schema.Types.ObjectId },
    posted: {
        type: Date,
        default: Date.now },
    postedBy: {
        type:Schema.Types.ObjectId,
        ref:'Users'},
    text: {type: String}

}, {collection: 'Message'});

module.exports = mongoose.model('Message', Message);
