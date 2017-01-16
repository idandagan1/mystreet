import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import FacebookLogin from 'components/facebook/facebook-button';
import { Strings } from 'resources';
import { SearchStreet } from 'components';
import logo from '../logo2.png';
import ProfileButton from './profile-button';
import './header.scss';


export default function Header(props) {

    const { isAuthenticated, loginSubmitted, searchSubmitted, user: { name } } = props;

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
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                    </button>
                    <Link className='navbar-brand' to='/'>
                        <img alt='logo' src={logo} width='23' height='23' />
                    </Link>
                </div>

                <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
                    <ul className='nav navbar-nav'>
                        {
                            isAuthenticated ?
                                <li><Link to='/mystreets'>My Streets</Link></li> :
                                null
                        }

                        <li><Link to='/'>Apartments</Link></li>
                        <li className='n-search-street-header'><SearchStreet searchStreet={searchSubmitted} /></li>
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
                                    { Strings.login }
                                </FacebookLogin>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

Header.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    loginSubmitted: PropTypes.func.isRequired,
    searchSubmitted: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};
