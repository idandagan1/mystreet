import React, { PropTypes } from 'react';
import { SearchStreet } from 'components';
import './dashboard.scss';

export default function Dashboard(props) {
    const { dashboardSearchSubmitted } = props;

    return (
        <div>
            <div className='n-dashboard-wrapper' />
            <div className='n-dashboard-search'>
                <div className='n-street-search'>
                    <div className='navbar-form'>
                        <SearchStreet searchStreet={dashboardSearchSubmitted} />
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.propTypes = {
    dashboardSearchSubmitted: PropTypes.func.isRequired,
};
