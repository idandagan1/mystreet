/* eslint-disable no-undef */
import React from 'react';
import './map.scss';

export default class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mapOptions: {
                center: { lat: 40.9418601, lng: 13.5616095 },
                zoom: 10,
                scrollwheel: false,
            },
        };
    }

    componentDidMount() {
        const { mapOptions } = this.state;

        const map = new google.maps.Map(this.mainMap, mapOptions);

        // Try W3C Geolocation (Preferred)
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                map.setZoom(17);
            }, () => {
                map.setCenter(mapOptions.center);
            });
        } else { // Browser doesn't support Geolocation
            map.setCenter(mapOptions.center);
        }
    }

    render() {
        return (
            <div ref={mainMap => { this.mainMap = mainMap; }} className='n-map-wrapper'></div>
        );
    }

}
