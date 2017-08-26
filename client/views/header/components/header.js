import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FacebookLogin from 'components/facebook/facebook-button';
import { SearchStreet } from 'components';
import * as utils from '../../../util/utils';
import logo from '../logo2.png';
import ProfileButton from './profile-button';
import './header.scss';


export default function Header(props) {

    const { Strings, isAuthenticated, logoutSubmitted, loginSubmitted, searchSubmitted, user: { name, facebook: { id } } } = props;
    const autoLoad = false;

    function onLanguageChange(e) {
        const { setLanguage } = props;
        utils.setCookie('language', e.target.getAttribute('value'));
        setLanguage(e.target.getAttribute('value'));
    }

    function getLanguages() {
        const { country } = props;

        return country !== 'en' ?
        (
            <li>
                <div className='n-lang btn-group' role='group' aria-label='...'>
                    <button
                        value='en'
                        type='button'
                        className='btn btn-default'
                        onClick={onLanguageChange}
                    >English</button>
                    {getUserLocation()}
                </div>
            </li>
        ) : null;
    }

    function getUserLocation() {
        const { country } = props;
        switch (country) {
            case 'IL':
                return <button value='he' type='button' className='btn btn-default' onClick={onLanguageChange}>עברית</button>
            default:
                return '';
        }
    }

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
                                <li><Link to='/mystreets'>{Strings.myStreetsTitle}</Link></li> :
                                null
                        }

                        <li><Link to='/business'>{Strings.businessTitle}</Link></li>
                        {getLanguages()}
                        <li className='n-search-street-header'>
                            <SearchStreet
                                Strings={Strings}
                                searchStreet={searchSubmitted}
                            />
                        </li>
                    </ul>

                    <ul className='nav navbar-nav navbar-right'>
                        {
                            isAuthenticated ?
                                <ProfileButton
                                    Strings={Strings}
                                    logoutSubmitted={logoutSubmitted}
                                    name={name}
                                    id={id}
                                /> :
                                <FacebookLogin
                                    appId='678252172335402'
                                    isLoggedIn={isAuthenticated}
                                    callback={loginSubmitted}
                                    autoLoad={autoLoad}
                                >
                                    {Strings.login}
                                </FacebookLogin>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
}

Header.propTypes = {
    Strings: PropTypes.shape({
        search: PropTypes.string,
    }),
    country: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    loginSubmitted: PropTypes.func.isRequired,
    logoutSubmitted: PropTypes.func.isRequired,
    searchSubmitted: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
};
