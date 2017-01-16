import React, { PropTypes, Component } from 'react';
import { GoogleSearch } from 'components';
import './search-street.scss';

export default class SearchStreet extends Component {

    static propTypes = {
        searchStreet: PropTypes.func.isRequired,
    };

    handleSubmit = street => {
        const { searchStreet } = this.props;
        searchStreet(street);
    }

    render() {

        return (
            <div className='form-group'>
                <GoogleSearch onSubmit={this.handleSubmit} />
            </div>
        );
    }
}
