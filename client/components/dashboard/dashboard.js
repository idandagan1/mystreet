import React, { PropTypes } from 'react';
import { SearchStreet } from 'components';
import './dashboard.scss';

export default function Dashboard(props) {
    const { dashboardSearchSubmitted } = props;

    return (
        <div>
            <div className='n-dashboard-wrapper' />
            <div className='n-dashboard-search'>
                <SearchStreet searchStreet={dashboardSearchSubmitted} />
            </div>
        </div>
    );
}

Dashboard.propTypes = {
    dashboardSearchSubmitted: PropTypes.func.isRequired,
};
