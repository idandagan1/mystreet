import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const streetSchema = new Schema({

    streetName: {
        type: String,
    },
    place_id: {
        type: String,
    },
    location: {
        type: [Number],
        index: '2dsphere',
    },
    address: {
        type: String,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    admins: [{
        type: ObjectId,
        ref: 'user',
    }],
    members: [{
        type: ObjectId,
        ref: 'user',
    }],
    postList: [{
        type: ObjectId,
        ref: 'post',
    }],
}, { collection: 'street' });

export const Street = mongoose.model('street', streetSchema);

export function addMember(newMemberID, streetID) {

    if (streetID == null || newMemberID == null) {
        return;
    }

    Street.findByIdAndUpdate(streetID, { $addToSet: { members: newMemberID } }).exec()
        .then(street => {
            if (street) {
                console.log('Added member');
            }
        });
}

export function removeMember(memberID, streetID) {

    if (streetID == null || memberID == null) {
        return;
    }

    Street.findByIdAndUpdate(streetID, { $pull: { members: memberID, admins: memberID } }, { new: true }).exec()
        .then(street => {
            if (street) {
                console.log('Removed member');
                if (street.members.length === 0) {
                    street.remove();
                    console.log('Removed street');
                }
            }
        });
}
