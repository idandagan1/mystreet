import React from 'react';
import { Link } from 'react-router';
import './search-street.scss';
import { Strings } from '../../resources';

class SearchStreet extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            streetname: ''
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
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
                        <input
                            id          = "pac-input"
                            type        = "text"
                            className   = "form-control"
                            name        = "streetname"
                            onChange    = {this.onChange}
                            placeholder = {Strings.findMyStreet}
                            value       = {this.state.streetname}
                        />
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