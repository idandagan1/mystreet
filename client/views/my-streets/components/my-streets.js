import React, { PropTypes } from 'react';
import { PostsFeed, Map } from 'components';
import { Strings } from 'resources';
import StreetNearby from './streetNearby';
import Street from './street';
import Member from './member';
import './my-streets.scss';

export default class MyStreets extends React.Component {

    static propTypes = {
        selectedStreet: PropTypes.shape({
            streetName: PropTypes.string,
            place_id: PropTypes.string,
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
        streetsNearby: PropTypes.array,
        isAuthenticated: PropTypes.bool.isRequired,
        addStreetSubmitted: PropTypes.func.isRequired,
        searchStreetSubmitted: PropTypes.func.isRequired,
        changePrimaryStreet: PropTypes.func.isRequired,
    };

    eachMember(member, i, userId) {

        if (member._id === userId) {
            const { activeUser } = this.props;
            return <Member member={activeUser} key={i} />;
        }

        return <Member member={member} key={i} />;
    }

    onJoinClick = () => {
        const { addStreetSubmitted, selectedStreet } = this.props;
        addStreetSubmitted(selectedStreet);
    }

    createMembersList = (members) => {
        const { activeUser: { userId, local: { streets } } } = this.props;
        if (!members || members.length === 0) {
            if (streets.length > 3) {
                return <div className='p5'><span>Max streets is 3</span></div>;
            }
            return <div className='p5'><span>{Strings.joinStreetTxt}</span></div>;
        }

        return (
            <ul style={{ padding: 10, listStyleType: 'none', textAlign: 'left' }}>
                {members.map((member, i) =>
                    this.eachMember(member, i, userId))
                }
            </ul>
        );
    }

    isMember = () => {
        const { selectedStreet: { members } } = this.props;
        const { activeUser: { userId } } = this.props;
        if (!members) {
            return false;
        }
        return members.find(x => x._id === userId) !== undefined;
    }

    onStreetClick = (street) => {
        const { searchStreetSubmitted, selectedStreet: { place_id } } = this.props;
        return place_id !== street.place_id ? searchStreetSubmitted(street) : null;
    }

    onChangePrimaryStreet = (street) => {
        const { changePrimaryStreet } = this.props;
        changePrimaryStreet(street);
    }

    getMyStreetsList = (mystreets) => {

        const { activeUser: { local: { primaryStreet } } } = this.props;

        if (!mystreets || mystreets.length === 0) {
            return <div className='p5'><span>{Strings.emptyStreetListTitle}</span></div>;
        }

        return (
            <ul style={{ padding: 10, listStyleType: 'none', textAlign: 'left' }}>
                {
                    mystreets.map((street, i) => {
                        const isPrimary = street._id === primaryStreet;
                        return (
                            <Street
                                onStreetClick={() => this.onStreetClick(street)}
                                onChangePrimaryStreet={() => this.onChangePrimaryStreet(street)}
                                streetName={street.streetName}
                                key={i}
                                isPrimary={isPrimary}
                            />);
                    })
                }
            </ul>
        );
    }

    getStreetsNearby = (streets) => {
        if (!streets || streets.length === 0) {
            return (<span>{Strings.noStreetsNearBy}</span>);
        }
        return streets.map((street, i) => {
            const { streetName, location, place_id, members } = street;
            return (
                <li key={i} onClick={() => this.onStreetClick(street)}>
                    <StreetNearby
                        streetName={streetName}
                        location={location}
                        place_id={place_id}
                        members={members.length}
                    />
                </li>
            );
        });
    }

    canUserJoinStreet = () => {
        const isMember = this.isMember();
        const { selectedStreet, activeUser: { local: { streets } } } = this.props;
        return !isMember && streets.length < 4 && selectedStreet.place_id;
    }

    render() {
        const { isAuthenticated, activeUser: { local: { streets } }, streetsNearby, selectedStreet, selectedStreet: { members, streetName, location } } = this.props;
        const isMember = this.isMember();

        return (
            <div className='n-mystreet'>
                <div className='n-mystreet-page-header'>
                    <span>{ streetName }</span>
                </div>
                <ol>
                    <li className='col-sm-3 sub-main-li hidden-sm  hidden-xs'>
                        <Map lat={location[1]} lng={location[0]} />
                    </li>
                    <li className='n-mystreet-content col-sm-4 sub-main-li'>
                        <div>
                            {
                                isMember === true ?
                                    <PostsFeed isMember={isMember} selectedStreet={selectedStreet} />
                                    : <div className='panel'>
                                        <div className='n-mystreet-h1'>
                                            <span>
                                                {Strings.StreetsNearbyTitle}
                                            </span>
                                        </div>
                                        <ul className='n-mystreet-streets-nearby-list'>
                                            { this.getStreetsNearby(streetsNearby) }
                                        </ul>
                                    </div>
                            }
                        </div>
                    </li>
                    <li className='col-md-2 col-sm-2 sub-main-li' style={{ minWidth: 200 }}>
                        <div className='panel' style={{ textAlign: 'center' }}>
                            <div className='n-mystreet-h1'>{Strings.memberstitle}</div>
                            {this.createMembersList(members)}
                            <div className='n-mystreet-footer'>
                                {
                                    this.canUserJoinStreet() ?
                                        <input
                                            type='button'
                                            className='n-mystreet__add-street-btn btn btn-sm'
                                            onClick={this.onJoinClick}
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
                                    <div className='n-mystreet-h1'>My Streets</div>
                                    <div className='n-mystreet-footer'>
                                        {this.getMyStreetsList(streets)}
                                    </div>
                                </div>
                                : null
                        }
                    </li>
                </ol>
            </div>
        );
    }
}
