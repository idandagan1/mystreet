/* eslint-disable no-undef */
import React, { Component, PropTypes } from 'react';
import { Strings } from 'resources';
import { Link } from 'react-router';
import './google-search.scss';

export default class GoogleSearch extends Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            streetName: '',
            placeId: '',
            location: {
                lat: null,
                lng: null,
            },
        };

        this.handleSearchClicked = this.handleSearchClicked.bind(this);
    }

    componentDidMount() {

        const input = this.search;
        const autocomplete = new google.maps.places.Autocomplete(input);

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.setState({
                streetName: place.address_components[0].short_name,
                placeId: place.place_id,
                location: {
                    lng: place.geometry.location.lng(),
                    lat: place.geometry.location.lat(),
                },
            });
        });
    }

    handleSearchClicked = e => {
        const { onSubmit } = this.props;
        const { streetName, location, placeId } = this.state;
        const res = {
            streetName,
            location,
            placeId,
        };

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
