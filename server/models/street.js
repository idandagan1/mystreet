var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var streetSchema = new Schema({

    name: {
        type: String,
        index:true,
        unique:true,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    postList: [{
        type: Schema.Types.ObjectId,
        ref: 'post'
    }]

},{collection: 'street'});

module.exports = mongoose.model('street', streetSchema);
