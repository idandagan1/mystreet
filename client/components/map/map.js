import React from 'react';
import './map.scss';

class Map extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            mapOptions: {
                center: {lat: 40.9418601, lng: 13.5616095},
                zoom: 10,
                scrollwheel: false
            }
        }
    }

    componentDidMount() {

        let browserSupportFlag = new Boolean();

        const map = new google.maps.Map(this.refs.mainMap, this.state.mapOptions),
            newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);

            // Try W3C Geolocation (Preferred)
        if (navigator && navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition( (position) => {
                this.setState({initialLocation: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)});
                map.setCenter(this.state.initialLocation);
                map.setZoom(17);
            }, () => {
                handleNoGeolocation(browserSupportFlag);
            });
        }

        // Browser doesn't support Geolocation
        else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
        }
        function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
                initialLocation = newyork;
            } else {
                initialLocation = newyork;
            }
            map.setCenter(initialLocation);
        }
    }

    render() {
        return (
            <div ref="mainMap" className="n-map-wrapper"></div>
        )
    }

}

export default Map;

