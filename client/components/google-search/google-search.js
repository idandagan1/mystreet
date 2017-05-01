/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import { Strings } from 'resources';
import './google-search.scss';


const initialState = {
    streetName: '',
    place_id: '',
    location: [34.7818, 32.0853],
}

export default class GoogleSearch extends Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {

        const input = this.search;
        const autocomplete = new google.maps.places.Autocomplete(input);

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.setState({
                streetName: place.address_components[0].long_name,
                place_id: place.place_id,
                location: [place.geometry.location.lng(), place.geometry.location.lat()],
            });
        });
    }

    handleSearchClicked = e => {
        e.preventDefault();
        const { onSubmit } = this.props;
        const { streetName, location, place_id } = this.state;

        if (!streetName || !place_id) {
            return;
        }

        const res = {
            streetName,
            location,
            place_id,
        };
        this.search.value = '';
        this.setState(initialState);
        onSubmit(res);
    };

    render() {
        return (
            <div className='n-google-search-form'>
                <form onSubmit={this.handleSearchClicked} className='form-horizontal'>
                    <input
                        type='text'
                        placeholder={Strings.findMyStreet}
                        autoComplete='off'
                        className='form-control n-google-search-textfield'
                        ref={search => { this.search = search; }}
                        required='true'
                    />
                    <input
                        type='submit'
                        className='btn n-google-search-btn-search'
                        value={Strings.search}
                    />
                </form>
            </div>
        );
    }
}
