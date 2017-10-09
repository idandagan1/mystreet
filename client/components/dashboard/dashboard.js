import React, { PropTypes } from 'react';
import { SearchStreet } from 'components';
import streetVideo from 'resources/videos/1.mp4';
import streetImage from 'resources/images/cover.jpg';
import './dashboard.scss';

export default class Dashboard extends React.Component {

    static propTypes = {
        dashboardSearchSubmitted: PropTypes.func.isRequired,
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
    };

    componentDidMount() {
        $('video').on('ended', () => {
            this.load();
            this.play();
        });
    }

    render() {
        const { dashboardSearchSubmitted, Strings } = this.props;
        return (
            <div className='n-dashboard'>
                <video
                    loop='true'
                    muted='true'
                    autoPlay='true'
                >
                    <source src={streetVideo} type='video/mp4' />
                </video>
                <img className='n-dashboard-img' src={streetImage} alt='street' />
                <h1 className='n-dashboard-title'>MyStreet</h1>
                <h3 className='n-dashboard-subtitle'>for a better neighborhood</h3>
                <div className='n-dashboard-search'>
                    <div className='n-street-search'>
                        <div className='navbar-form'>
                            <SearchStreet
                                Strings={Strings}
                                searchStreet={dashboardSearchSubmitted}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
