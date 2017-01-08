import React, { PropTypes, Component } from 'react';
import GoogleSearch from 'components/google-search/google-search';
import './search-street.scss';

export default class SearchStreet extends Component {

    static propTypes = {
        searchStreet: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            streetname: '',
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(street) {
        const { searchStreet } = this.props;
        searchStreet(street);
    }

    render() {

        return (
            <div className='n-street-search'>
                <div className='navbar-form'>
                    <div className='form-group'>
                        <GoogleSearch onSubmit={this.onSubmit} />
                    </div>
                </div>
            </div>
        );
    }
}
