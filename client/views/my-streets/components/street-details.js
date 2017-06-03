import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import Street from './street';
import Member from './member';

export default function StreetDetails({ props }) {

    const {
        isAuthenticated,
        activeUser: { local: { streets } },
        selectedStreet: { members },
    } = props;

    function onJoinClick() {
        const { addStreetSubmitted, selectedStreet } = props;
        addStreetSubmitted(selectedStreet);
    }

    function isMember() {
        const { activeUser: { userId } } = props;
        if (!members) {
            return false;
        }
        return members.find(x => x._id === userId) !== undefined;
    }

    function eachMember(member, i, userId) {

        if (member._id === userId) {
            const { activeUser } = props;
            return <Member member={activeUser} key={i} />;
        }

        return <Member member={member} key={i} />;
    }

    function createMembersList() {
        const { activeUser: { userId } } = props;
        if (!members || members.length === 0) {
            if (streets.length > 3) {
                return <div className='p5'><span>Max streets is 3</span></div>;
            }
            return <div className='p5'><span>{Strings.joinStreetTxt}</span></div>;
        }

        return (
            <ul style={{ padding: 10, listStyleType: 'none', textAlign: 'left' }}>
                {members.map((member, i) =>
                    eachMember(member, i, userId))
                }
            </ul>
        );
    }

    function onChangePrimaryStreet(street) {
        const { changePrimaryStreet } = props;
        changePrimaryStreet(street);
    }

    function onLeaveStreet(street) {
        const { leaveStreetSubmitted } = props;
        leaveStreetSubmitted(street);
    }

    function onStreetClick(street) {
        const { searchStreetSubmitted, selectedStreet: { placeId } } = props;
        return placeId !== street.placeId ? searchStreetSubmitted(street) : null;
    }

    function canUserJoinStreet() {
        const ismember = isMember();
        const { selectedStreet } = props;
        return !ismember && streets.length < 4 && selectedStreet.placeId;
    }

    function getMyStreetsList(mystreets) {

        const { activeUser: { local: { primaryStreet } } } = props;

        if (!mystreets || mystreets.length === 0) {
            return <div className='p5'><span>{Strings.emptyStreetListTitle}</span></div>;
        }

        return (
            <ul style={{ padding: 10, listStyleType: 'none', textAlign: 'left' }}>
                {
                    mystreets.map((street, i) => {
                        const isPrimary = street._id === primaryStreet._id;
                        return (
                            <Street
                                onStreetClick={() => onStreetClick(street)}
                                onChangePrimaryStreet={() => onChangePrimaryStreet(street)}
                                onLeaveStreetClick={() => onLeaveStreet(street)}
                                streetName={street.streetName}
                                key={i}
                                isPrimary={isPrimary}
                            />);
                    })
                }
            </ul>
        );
    }

    return (
        <div>
            <div className='panel' style={{ textAlign: 'center' }}>
                <div className='n-mystreet-h1'>{Strings.memberstitle}</div>
                {createMembersList()}
                <div className='n-mystreet-footer'>
                    {
                        canUserJoinStreet() ?
                            <input
                                type='button'
                                className='n-mystreet__add-street-btn btn btn-sm'
                                onClick={onJoinClick}
                                disabled={!isAuthenticated}
                                title='You must sign in'
                                value={Strings.join}
                            />
                            : null
                    }
                </div>
            </div>
            {
                streets ?
                    <div className='panel' style={{ textAlign: 'center' }}>
                        <div className='n-mystreet-h1'>{Strings.myStreetsTitle}</div>
                        <div className='n-mystreet-footer'>
                            {getMyStreetsList(streets)}
                        </div>
                    </div>
                    : null
            }
        </div>
    );
}

StreetDetails.propTypes = {
    props: PropTypes.shape({
        selectedStreet: PropTypes.shape({
            streetName: PropTypes.string,
            placeId: PropTypes.string,
            location: PropTypes.array,
            members: PropTypes.array,
        }),
        members: PropTypes.array,
        activeUser: PropTypes.shape({
            userId: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
        isAuthenticated: PropTypes.bool.isRequired,
        addStreetSubmitted: PropTypes.func.isRequired,
        searchStreetSubmitted: PropTypes.func.isRequired,
        changePrimaryStreet: PropTypes.func.isRequired,
        leaveStreetSubmitted: PropTypes.func.isRequired,
    }),
}
