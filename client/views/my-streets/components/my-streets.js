import React, { PropTypes } from 'react';
import { PostsFeed, Map } from 'components';
import { Strings } from 'resources';
import StreetNearby from './streetNearby';
import StreetDetails from './street-details';
import './my-streets.scss';

export default class MyStreets extends React.Component {

    static propTypes = {
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
        streetsNearby: PropTypes.array,
        isAuthenticated: PropTypes.bool.isRequired,
        addStreetSubmitted: PropTypes.func.isRequired,
        leaveStreetSubmitted: PropTypes.func.isRequired,
        searchStreetSubmitted: PropTypes.func.isRequired,
        changePrimaryStreet: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            showStreetDetails: false,
            smallResolution: false,
        };
    }

    updateDimensions = () => {
        if(window.innerWidth < 760) {
            this.setState({ smallResolution: true });
        } else {
            this.setState({ smallResolution: false, showStreetDetails: false });
        }
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    onStreetClick = (street) => {
        const { searchStreetSubmitted, selectedStreet: { placeId } } = this.props;
        return placeId !== street.placeId ? searchStreetSubmitted(street) : null;
    }

    getStreetsNearby = (streets) => {
        if (!streets || streets.length === 0) {
            return (<span>{Strings.noStreetsNearBy}</span>);
        }
        return streets.map((street, i) => {
            const { streetName, location, placeId, members } = street;
            return (
                <li key={i} onClick={() => this.onStreetClick(street)}>
                    <StreetNearby
                        streetName={streetName}
                        location={location}
                        placeId={placeId}
                        members={members.length}
                    />
                </li>
            );
        });
    }

    onDetailsClick = () => {
        const { showStreetDetails } = this.state;
        this.setState({ showStreetDetails: !showStreetDetails });
    }

    getDetailsBtnValue = () => {
        const { showStreetDetails } = this.state;
        return showStreetDetails ? Strings.postsFeedBtn : Strings.moreBtn;
    }
    isMember = () => {
        const { activeUser: { local: { streets } } } = this.props;
        const { selectedStreet: { _id } } = this.props;
        if (!streets) {
            return false;
        }
        return streets.find(x => x._id === _id) !== undefined;
    }

    render() {
        const {
            streetsNearby, selectedStreet,
            selectedStreet: { streetName, location, placeId, address },
            activeUser: { facebook: { first_name } },
        } = this.props;
        const isMember = this.isMember();
        const { smallResolution, showStreetDetails } = this.state;

        return (
            <div className='n-mystreet'>
                <div className='n-mystreet-page-header'>
                    <div>{ streetName }</div>
                    <div className='n-mystreet-address' title={address}>{address}</div>
                    <div className='visible-xs'>
                        <button
                            type='submit'
                            className='btn btn-sm'
                            onClick={this.onDetailsClick}
                        >
                            {this.getDetailsBtnValue()}
                        </button>
                    </div>
                </div>
                {
                    smallResolution && showStreetDetails ?

                        <div className='globalContainer col-xs-7'>
                            <div className='visible-xs col-xs-12'>
                                <StreetDetails props={this.props} />
                            </div>
                            <div className='visible-xs col-xs-12'>
                                <Map lat={location[1]} lng={location[0]} placeId={placeId} />
                            </div>
                        </div> :
                        <div className='globalContainer col-xs-7 col-md-9 col-sm-9'>
                            <div className='hidden-xs col-md-3 col-sm-3 sub-main-li' style={{ minWidth: 200 }}>
                                <div className='hidden-xs'>
                                    <StreetDetails props={this.props} />
                                </div>
                            </div>
                            <div className='col-md-4 col-xs-12 col-sm-6 sub-main-li'>
                                <div>
                                    {
                                        isMember === true ?
                                            <PostsFeed username={first_name} isMember={isMember} selectedStreet={selectedStreet} /> :
                                            <div className='panel col-md-12'>
                                                <div className='n-mystreet-h1'>
                                                    <span>
                                                        {Strings.StreetsNearbyTitle}
                                                    </span>
                                                </div>
                                                <div className='col-md-12 globalContainer'>
                                                    <ul className='n-mystreet-streets-nearby-list'>
                                                        { this.getStreetsNearby(streetsNearby) }
                                                    </ul>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className='col-sm-3 sub-main-li hidden-sm hidden-xs'>
                                <Map lat={location[1]} lng={location[0]} placeId={placeId}/>
                            </div>
                        </div>
                }
            </div>
        );
    }
}
