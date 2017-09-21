/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import * as mapActions from 'actions/map-action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './map.scss';

function select(state) {
    const { app: { mapSettings } } = state;

    return {
        mapSettings,
    };
}

class Map extends Component {
    static propTypes = {
        lat: PropTypes.number,
        lng: PropTypes.number,
        placeId: PropTypes.string,
        friends: PropTypes.array,
        selectedUser: PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
        mapSettings: PropTypes.shape({
            placeId: PropTypes.strings,
            location: PropTypes.shape({
                lat: PropTypes.number,
                lng: PropTypes.number,
            }),
            isMapInitialized: PropTypes.bool,
        }),
        mapInitialized: PropTypes.func.isRequired,
        radius: PropTypes.number,
    };

    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            showDefaultLocation: true,
        };
    }

    setMap(lat, lng, placeId) {
        const location = new google.maps.LatLng(lat, lng);
        this.map.setCenter(location);
        this.marker.setPlace(({
            placeId,
            location,
        }));
    }

    initializeMap() {
        // Try W3C Geolocation (Preferred)
        const { mapInitialized } = this.props;

        let location;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.geocoder.geocode({ location }, (results, status) => {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            mapInitialized({
                                placeId: results[1].place_id,
                                location: { lat: location.lat(), lng: location.lng() },
                                isMapInitialized: true,
                            });
                            const { showDefaultLocation } = this.state;
                            if (showDefaultLocation) {
                                this.setMap(location.lat(), location.lng(), results[1].place_id);
                            }
                        }
                    }
                });
            });
        }
    }

    deleteMarkers() {
        const { markers } = this.state;
        markers.forEach(marker => marker.setMap(null));
        this.setState({ markers: [] });
    }

    setUsersMarkerOnMap = (users, showCircle) => {

        if (!users) {
            return;
        }
        this.deleteMarkers();
        const groupedUsers = this.groupBy(users, 'primaryStreet');

        for (const placeId in groupedUsers) {
            if (!placeId) continue;

            this.service.getDetails({ placeId }, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    let lastmarker;
                    const { markers } = this.state;
                    const marker = new google.maps.Marker({
                        position: place.geometry.location,
                        map: this.map,
                    })
                    markers.push(marker);
                    this.setState({ markers });

                    const mwindow = this.createStreetInfoWindow(groupedUsers[placeId]);
                    google.maps.event.addListener(marker, 'click', () => {

                        if ((marker === lastmarker) && this.infowindow.isOpen) {
                            this.infowindow.close();
                            this.infowindow.isOpen = false;
                            return;
                        }
                        lastmarker = marker;
                        this.infowindow.setContent(mwindow);
                        this.infowindow.open(this.map, marker);
                        this.infowindow.isOpen = true;
                    });

                }
            });
        }
    }

    groupBy(xs, key) {
        return xs.reduce((rv, x) => {
            x.local[key] ? (rv[x.local[key].placeId] = rv[x.local[key].placeId] || []).push(x) : void 0;
            return rv;
        }, {});
    }

    createStreetInfoWindow(members) {
        return `<div class="n-info-window">
                    <h4>Members:</h4>
                    <div class="n-info-window-members-list">
                        ${this.createMembersList(members)}
                    </div>
                </div>`;
    }

    createMembersList(members) {
        return members.reduce((list, member) => {
            const { name, facebook: { id }, local: { primaryStreet } } = member;
            if (!primaryStreet) {
                return;
            }
            const picturePath = `http://graph.facebook.com/${id}/picture?type=normal`;
            const linkToUserFacebook = `https://www.facebook.com/app_scoped_user_id/${id}`;

            return list.concat(`
            <div class="n-info-window-member">
                                <img class='n-comment-user-icon' alt='user-icon' src=${picturePath} role='img' />
                                <a
                                    class='n-post-user'
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    href=${linkToUserFacebook}
                                >
                                    <div class="n-info-window-user">${name}</div>
                                </a>
                            </div>
            `);
        }, '');
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { lat, lng, placeId, users: oldUsers, radius } = this.props;
        const { lat: nextLat, lng: nextLng, placeId: nextPlace, users, radius: newRadius } = nextProps;

        return lat !== nextLat || lng !== nextLng || placeId !== nextPlace || (users && oldUsers.length !== users.length) || radius !== newRadius;
    }

    componentDidUpdate(prevProps, prevState) {
        const { lat, lng, friends, selectedUser, placeId, users: NewUsers, radius, mapSettings } = this.props;
        const users = selectedUser ? [selectedUser, ...friends] : friends;

        if (NewUsers) {
            this.setUsersMarkerOnMap(NewUsers, true);
        } else {
            this.setMap(lat, lng, placeId);
            this.setUsersMarkerOnMap(users);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { placeId } = nextProps;
        if (placeId) {
            this.setState({ showDefaultLocation: false });
        }
    }

    componentDidMount() {
        const { lat, lng, placeId, mapSettings, radius } = this.props;

        this.mapOptions = {
            center: { lat, lng },
            zoom: 15,
            scrollwheel: false,
        };
        this.infowindow = new google.maps.InfoWindow();
        this.infowindow.isOpen = false;
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map(this.mainMap, this.mapOptions);
        this.marker = new google.maps.Marker({ map: this.map });
        this.service = new google.maps.places.PlacesService(this.map);

        if (!placeId) {
            mapSettings.isMapInitialized ?
                this.setMap(mapSettings.location.lat, mapSettings.location.lng, mapSettings.placeId)
                : this.initializeMap();
        } else {
            this.forceUpdate();
        }

        google.maps.event.addListener(this.map, 'click', () => {
            this.infowindow.isOpen = false;
            this.infowindow.close();
        });

    }

    handleLocateUser = e => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
            this.map.setZoom(17);
        }, () => {
            this.map.setCenter(this.mapOptions.center);
        });
    };

    render() {
        return (
            <div className='n-map'>
                <div ref={mainMap => { this.mainMap = mainMap; }} className='n-map-wrapper' />
                {
                    navigator && navigator.geolocation ?
                        <button className='n-map__locate-btn' onClick={this.handleLocateUser}>Locate Me</button> :
                        null
                }
            </div>
        );
    }

}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ ...mapActions }, dispatch);
}

export default connect(select, matchDispatchToProps)(Map);
