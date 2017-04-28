import React, { PropTypes } from 'react';
import { PostsFeed, Map } from 'components';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import StreetNearby from './streetNearby';
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
    };

    constructor(props) {
        super(props);
        this.state = {
            members: [],
        };
    }

    eachMember(member, i, userId) {

        if (member._id === userId) {
            member = this.props.activeUser;
        }
        return (
            <div className='n-mystreet-member' key={i}>
                <img alt='user-icon' src={usericon} className='n-comment-user-icon' />
                <span className='n-member-name'>{member.name}</span>
            </div>
        );
    }

    componentWillReceiveProps = (nextProps) => {
        const members = nextProps.selectedStreet.members || [];
        this.setState({ members });
    }

    onJoinClick = () => {
        const { addStreetSubmitted, selectedStreet } = this.props;
        addStreetSubmitted(selectedStreet);
    }

    createMembersList = (members) => {
        const { activeUser: { userId } } = this.props;
        return members.map((member, i) => this.eachMember(member, i, userId));
    }

    isMember = () => {
        const { members } = this.state;
        const { activeUser: { userId } } = this.props;
        return members.find(x => x._id === userId) !== undefined;
    }
    onStreetNearbyClick = (street) => {
        const { searchStreetSubmitted } = this.props;
        searchStreetSubmitted(street);
    }

    getStreetsNearby = (streets) => {
        if (!streets || streets.length === 0) {
            return (<span>{Strings.noStreetsNearBy}</span>)
        }
        return streets.map((street, i) => {
            const { streetName, location, place_id, members } = street;
            return (
                <li key={i} onClick={() => this.onStreetNearbyClick(street)}>
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

    handleAddStreet = e => {
        const { addStreetSubmitted, selectedStreet } = this.props;
        addStreetSubmitted(selectedStreet);
    };

    render() {
        const { members } = this.state;
        const { isAuthenticated, streetsNearby, selectedStreet, selectedStreet: { streetName, location } } = this.props;
        const isMember = this.isMember();

        return (
            <div className='n-mystreet'>
                <div className='n-mystreet-page-header'>{ streetName }</div>
                <ol>
                    <li className='col-md-3 sub-main-li'>
                        <Map lat={location[1]} lng={location[0]} />
                    </li>
                    <li className='n-mystreet-content col-md-4 sub-main-li'>
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
                    <li className='col-md-2 sub-main-li'>
                        <div className='panel n-mystreet-group-details'>
                            <span className='n-mystreet-h1'>{Strings.memberstitle}</span>
                            <div className='n-mystreet-members-panel'>
                                {members.length > 0 ? this.createMembersList(members) : 'Be the first to join the street'}
                            </div>
                            <div className='n-mystreet-footer'>
                                {
                                    isMember !== true ?
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
                    </li>
                </ol>
            </div>
        );
    }
}
