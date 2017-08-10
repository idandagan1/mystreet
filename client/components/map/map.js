/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import './map.scss';


export default class Map extends Component {
    static propTypes = {
        lat: PropTypes.number,
        lng: PropTypes.number,
        placeId: PropTypes.string,
        friends: PropTypes.array,
        activeUser: PropTypes.shape({
            userId: PropTypes.string,
            name: PropTypes.string,
            local: PropTypes.shape({
                isPremium: PropTypes.bool,
                lastLogged: PropTypes.string,
                streets: PropTypes.array,
            }),
        }),
    };

    componentDidMount() {
        const { lat, lng, friends, activeUser } = this.props;
        const users = activeUser ? [activeUser, ...friends] : friends;

        this.mapOptions = {
            center: { lat, lng },
            zoom: 15,
            scrollwheel: false,
        };
        this.infowindow = new google.maps.InfoWindow();
        this.infowindow.isOpen = false;
        this.map = new google.maps.Map(this.mainMap, this.mapOptions);
        this.marker = new google.maps.Marker({ map: this.map });
        this.service = new google.maps.places.PlacesService(this.map);

        this.setUsersMarkerOnMap(users);
        google.maps.event.addListener(this.map, 'click', () => {
            this.infowindow.isOpen = false;
            this.infowindow.close();
        });

    }

    setUsersMarkerOnMap = (users) => {

        if (!users) {
            return;
        }
        const groupedUsers = this.groupBy(users, 'primaryStreet');

        for (const placeId in groupedUsers) {
            if (!placeId) continue;

            this.service.getDetails({ placeId }, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    let lastmarker;
                    const marker = new google.maps.Marker({
                        map: this.map,
                        position: place.geometry.location,
                    })
                    const mwindow = this.createStreetInfoWindow(groupedUsers[placeId]);
                    marker.setVisible(true);
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
            (rv[x.local[key].placeId] = rv[x.local[key].placeId] || []).push(x);
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
        const { lat, lng, placeId } = this.props;
        const { lat: nextLat, lng: nextLng, placeId: nextPlace, friends: newFriends } = nextProps;

        return lat !== nextLat || lng !== nextLng || placeId !== nextPlace;
    }

    componentDidUpdate(prevProps, prevState) {
        const { lat, lng, placeId, friends, activeUser } = this.props;
        const users = activeUser ? [activeUser, ...friends] : friends;

        this.mapOptions = {
            center: { lat, lng },
            zoom: 15,
            scrollwheel: false,
        };

        this.setUsersMarkerOnMap(users);
        this.map.setCenter(this.mapOptions.center);
        this.marker.setPlace(({
            placeId,
            location: { lat, lng },
        }));

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
