import React, { PropTypes } from 'react';
import { SearchStreet } from 'components';
import streetVideo from 'resources/videos/1.mp4';
import streetImage from 'resources/images/cover.png';
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
                <img src={streetImage} alt='street' />
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
