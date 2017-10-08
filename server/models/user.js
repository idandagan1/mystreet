/* eslint-disable no-param-reassign */
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    local: {
        isPremium: {
            type: Boolean,
            default: false,
        },
        lastLogged: {
            type: Date,
            default: Date.now,
        },
        primaryStreet: {
            type: ObjectId,
            default: null,
            ref: 'street',
        },
        streets: [{
            type: ObjectId,
            ref: 'street',
        }],
        job: {
            type: String,
        },
        college: {
            type: String,
        },
        personalDetails: {
            type: ObjectId,
            ref: 'personalDetails',
        },
        dateOfBirth: {
            type: Date,
        },
    },
    facebook: {
        id: String,
        picture: String,
        token: String,
        email: String,
        name: String,
        first_name: String,
        last_name: String,
        gender: String,
        friends: [{
            type: ObjectId,
            ref: 'user',
        }],
    },

}, { collection: 'user' });
mongoose.model('friends', userSchema);
export const User = mongoose.model('user', userSchema);
