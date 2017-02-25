/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import { Strings } from 'resources';
import { Link } from 'react-router';
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
                streetName: place.address_components[0].short_name,
                place_id: place.place_id,
                location: [place.geometry.location.lng(), place.geometry.location.lat()],
            });
        });
    }

    handleSearchClicked = e => {
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
            <div>
                <ol className='list-inline'>
                    <li>
                        <input
                            placeholder={Strings.findMyStreet}
                            id='pac-input'
                            className='form-control n-search-textfield'
                            ref={search => { this.search = search; }}
                        />

                        <div ref={lblresult => { this.lblresult = lblresult; }} />
                    </li>
                    <li>
                        <Link to='/mystreets'>
                            <button onClick={this.handleSearchClicked} className='btn n-search-btn-search'>
                                {Strings.search}
                            </button>
                        </Link>
                    </li>
                </ol>
            </div>
        );
    }
}
