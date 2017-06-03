/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import './map.scss';

const defualtLocation = new google.maps.LatLng(40.69847032728747, -73.9514422416687);

export default class Map extends Component {
    static propTypes = {
        lat: PropTypes.number,
        lng: PropTypes.number,
        placeId: PropTypes.string,
    };

    componentDidMount() {
        const { lat, lng, placeId } = this.props;
        let initialLocation = defualtLocation;
        this.mapOptions = {
            center: { lat, lng },
            zoom: 15,
            scrollwheel: false,
        };
        this.infowindow = new google.maps.InfoWindow();
        this.map = new google.maps.Map(this.mainMap, this.mapOptions);
        this.marker = new google.maps.Marker({ map: this.map });

        this.marker.setPlace(({
            placeId: placeId || 'a',
            location: { lat, lng },
        }));

        google.maps.event.addListener(this.marker, 'click', () => {
            this.infowindow.open(this.map, this.marker);
        });

        /*if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                this.map.setCenter(initialLocation);
            });
        } else {
            this.map.setCenter(initialLocation);
        }*/
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { lat, lng, placeId } = this.props;
        const { lat: nextLat, lng: nextLng, placeId: nextPlace } = nextProps;

        return lat !== nextLat || lng !== nextLng || placeId !== nextPlace;
    }

    componentDidUpdate(prevProps, prevState) {
        const { lat, lng, placeId } = this.props;

        this.mapOptions = {
            center: { lat, lng },
            zoom: 15,
            scrollwheel: false,
        };

        this.map.setCenter(this.mapOptions.center);
        this.marker.setPlace(({
            placeId,
            location: { lat, lng },
        }));

        /*google.maps.event.addListener(this.marker, 'click', () => {
            this.infowindow.open(this.map, this.marker);
        });*/
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
