import React, { PropTypes } from 'react';
import { SearchStreet } from 'components';
import streetVideo from 'resources/videos/1.mp4';
import './dashboard.scss';

export default function Dashboard(props) {
    const { dashboardSearchSubmitted } = props;

    return (
        <div>
            <video
                loop='true'
                muted='true'
                autoPlay='true'
            >
                <source src={streetVideo} type='video/mp4' />
            </video>
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
