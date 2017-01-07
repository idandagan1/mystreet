import React, { PropTypes } from 'react';
import { SearchStreet } from 'components';
import './dashboard.scss';

export default function Dashboard(props) {
    const { searchStreet } = props;

    return (
        <div>
            <div className='n-dashboard-wrapper' />
            <div className='n-dashboard-search'>
                <SearchStreet searchStreet={searchStreet} />
            </div>
        </div>
    );
}

Dashboard.propTypes = {
    street: PropTypes.object.isRequired,
    searchStreet: PropTypes.func.isRequired,
};
