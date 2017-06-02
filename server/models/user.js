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
        personalDetails: {
            type: ObjectId,
            ref: 'personalDetails',
        },
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String,
        first_name: String,
        last_name: String,
        gender: String,
    },

}, { collection: 'user' });

export const User = mongoose.model('user', userSchema);
