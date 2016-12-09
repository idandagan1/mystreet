import React, {Component} from 'react';
import { Strings } from '../../resources';
import './google-search.scss';

class GoogleSearch extends React.Component{

    componentDidMount() {

        const input = this.refs.search;
        const autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', ()=> {});
    }

    render() {
        return (
            <div>
                <input placeholder={Strings.findMyStreet} id="pac-input" className="form-control" ref="search"/>
                <div ref="lblresult" ></div>
            </div>
        )
    }
};

export default GoogleSearch;
