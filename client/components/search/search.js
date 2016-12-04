import React from 'react';
import { Link } from 'react-router';
import './search.scss';

class Search extends React.Component {

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
                            type        = "text"
                            className   = "form-control"
                            name        = "streetname"
                            onChange    = {this.onChange}
                            placeholder = "Find my street.."
                            value       = {this.state.streetname}
                        />
                    </div>
                    <button type="submit" className="btn n-btn-search">Search</button>
                </form>
            </div>
        )

    }
}

Search.propTypes = {
    searchStreet: React.PropTypes.func.isRequired
}

export default Search;
