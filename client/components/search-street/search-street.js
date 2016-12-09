import React from 'react';
import './search-street.scss';
import { Strings } from '../../resources';
import  GoogleSearch  from '../GoogleSearch/GoogleSearch';


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
            <div className="col-md-12 n-search-wrapper">
                <form className="navbar-form" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <GoogleSearch />
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
