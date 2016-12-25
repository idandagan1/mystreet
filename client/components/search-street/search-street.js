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

    onSubmit(e) {
        e.preventDefault();
        this.props.searchStreet(this.state).then(
            (res) => {
                if (res) {
                    console.log(res);
                }
            })
    }

    render() {

        return (
            <div className="n-street-search">
                <form className="navbar-form" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <GoogleSearch/>
                    </div>
                    <button type="submit" className="btn n-btn-search">{Strings.search}</button>
                </form>

            </div>
        )
    }
}

SearchStreet.propTypes = {
    searchStreet: React.PropTypes.func.isRequired
}

export default SearchStreet;
