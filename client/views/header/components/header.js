import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import FacebookLogin from 'components/facebook/facebook-button';
import logo from '../logo2.png';
import ProfileButton from './profile-button';
import './header.scss';


export default class Header extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired,
        loginSubmitted: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
    };

    render() {
        const { isAuthenticated, loginSubmitted, user: { name } } = this.props;

        return (
            <nav className='navbar navbar-default n-header-theme'>
                <div className='container-fluid'>

                    <div className='navbar-header'>
                        <button
                            type='button'
                            className='navbar-toggle collapsed'
                            data-toggle='collapse'
                            data-target='#bs-example-navbar-collapse-1'
                            aria-expanded='false'
                        >
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <Link className='navbar-brand' to='/'>
                            <img alt='logo' src={logo} width='23' height='23' />
                        </Link>
                    </div>

                    <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
                        <ul className='nav navbar-nav'>
                            <li><Link to='/mystreets'>My Streets</Link></li>
                            <li><Link to='/'>Apartments</Link></li>
                        </ul>

                        <ul className='nav navbar-nav navbar-right'>
                            {
                                isAuthenticated ?
                                    <ProfileButton name={name} /> :
                                    <FacebookLogin
                                        appId='678252172335402'
                                        isLoggedIn={isAuthenticated}
                                        callback={loginSubmitted}
                                    >
                                        Login
                                    </FacebookLogin>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
