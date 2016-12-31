import React from 'react';
import { Strings } from 'resources';
import GoogleSearch from 'components/google-search/google-search';
import './search-street.scss';

class SearchStreet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            streetname: ''
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(street) {

    }

    render() {

        return (
            <div className="n-street-search">
                <div className="navbar-form">
                    <div className="form-group">
                        <GoogleSearch onSubmit={this.onSubmit}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default SearchStreet;
