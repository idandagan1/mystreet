import React, {Component} from 'react';
import { Strings } from 'resources';
import './google-search.scss';

class GoogleSearch extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            short_name:'',
            placeId:'',
            location:{}
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {

        const input = this.refs.search,
            autocomplete = new google.maps.places.Autocomplete(input);

        google.maps.event.addListener(autocomplete, 'place_changed', ()=> {
            let place = autocomplete.getPlace();
            this.setState({
                short_name: place.address_components[0].short_name,
                placeId: place.place_id,
                location: {
                    lng: place.geometry.location.lng(),
                    lat: place.geometry.location.lat()
                }
            });
        })
    }

    onSubmit(){

        const res = {
            street: this.state.short_name,
            location: this.state.location,
            placeId: this.state.placeId
        }

        this.props.onSubmit(res);
    }

    render() {
        return (
            <div>
                <ol className="list-inline">
                    <li>
                        <input placeholder={Strings.findMyStreet} id="pac-input" className="form-control n-search-textfield" ref="search"/>

                        <div ref="lblresult"></div>
                    </li>
                    <li>
                        <button onClick={this.onSubmit} className="btn n-btn-search">{Strings.search}</button>
                    </li>
                </ol>
            </div>
        )
    }
}

GoogleSearch.propTypes = {
    onSubmit: React.PropTypes.func.isRequired
}

export default GoogleSearch;
