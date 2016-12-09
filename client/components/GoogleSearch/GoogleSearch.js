import React, {Component} from 'react';
import './GoogleSearch.scss';

class GoogleSearch extends React.Component{

    componentDidMount() {

        const input = this.refs.search;
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo(this.refs.lblresult);
    }

    render() {
        return (
            <div>
                <input id="pac-input" className="form-control" ref="search"/>
                <div ref="lblresult" ></div>
            </div>
        )
    }
};

export default GoogleSearch;
