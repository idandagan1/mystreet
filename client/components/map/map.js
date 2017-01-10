/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import './map.scss';

export default class Map extends Component {
    static propTypes = {
        lat: PropTypes.number,
        lng: PropTypes.number,
    };

    componentDidMount() {
        const { lat, lng } = this.props;
        this.mapOptions = {
            center: { lat, lng },
            zoom: 10,
            scrollwheel: false,
        };

        this.map = new google.maps.Map(this.mainMap, this.mapOptions);
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { lat, lng } = this.props;
        const { lat: nextLat, lng: nextLng } = nextProps;

        return lat !== nextLat || lng !== nextLng;
    }

    componentDidUpdate(prevProps, prevState) {
        const { lat, lng } = this.props;

        this.mapOptions = {
            center: { lat, lng },
            zoom: 10,
            scrollwheel: false,
        };

        this.map.setCenter(this.mapOptions.center);
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
