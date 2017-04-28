import React, { PropTypes } from 'react';
import streeticon from 'resources/images/street-icon.png';

export default function StreetNearby(props) {
    const { place_id, location, members, streetName } = props;

    return (
        <div className='n-mystreet-street-table'>
            <div className='n-mystreet-left-col'>
                <img alt='street-icon' src={streeticon} className='n-mystreet-street-icon' />
            </div>
            <div className='n-mystreet-right-col'>
                <div className='n-mystreet-street-name-title'>
                    <span >
                        <b>Street:</b> {streetName}
                    </span>
                </div>
                <div className='n-mystreet-members-title'>
                    <b>Members:</b> {members}
                </div>
            </div>
        </div>
    );
}

StreetNearby.propTypes = {
    place_id: PropTypes.string,
    members: PropTypes.number,
    location: PropTypes.array,
    streetName: PropTypes.string,
};
