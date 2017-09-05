import React, { PropTypes } from 'react';
import Cookies from 'universal-cookie';
import Street from './street';
import Member from './member';

const cookies = new Cookies();

export default function StreetDetails({ props }) {

    const {
        isAuthenticated,
        activeUser: { local: { streets } },
        selectedStreet: { members },
        Strings,
    } = props;

    function onJoinClick() {
        const { addStreetSubmitted, selectedStreet } = props;
        addStreetSubmitted(selectedStreet);
    }

    function isMember() {
        const { activeUser: { _id } } = props;
        if (!members) {
            return false;
        }
        return members.find(x => x._id === _id) !== undefined;
    }

    function eachMember(member, i, userId) {
        const { activeUser, userSelected } = props;
        return member._id === userId ?
            <Member member={activeUser} userSelected={userSelected} key={i} /> :
            <Member member={member} key={i} userSelected={userSelected} />;
    }

    function createMembersList() {
        const { activeUser: { _id } } = props;
        if (!members || members.length === 0) {
            if (streets.length > 3) {
                return <div className='p5'><span>{Strings.maxStreetMsg}</span></div>;
            }
            return <div className='p5'><span>{Strings.joinStreetTxt}</span></div>;
        }

        return (
            <ul id='mystreets-memberslist' style={{ padding: 10, listStyleType: 'none', textAlign: 'left' }}>
                {members.map((member, i) =>
                    eachMember(member, i, _id))
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
        cookies.set('st', street.placeId, { path: '/' });
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
            <ul style={{ padding: 7, listStyleType: 'none', textAlign: 'left' }}>
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
            _id: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
        isAuthenticated: PropTypes.bool.isRequired,
        addStreetSubmitted: PropTypes.func.isRequired,
        searchStreetSubmitted: PropTypes.func.isRequired,
        changePrimaryStreet: PropTypes.func.isRequired,
        leaveStreetSubmitted: PropTypes.func.isRequired,
        userSelected: PropTypes.func.isRequired,
    }),
}
