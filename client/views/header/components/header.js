import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { SearchStreet } from 'components';
import FacebookLogin from 'components/facebook/facebook-button';
import * as utils from '../../../util/utils';
import logo from '../logo2.png';
import ProfileButton from './profile-button';
import './header.scss';


export default function Header(props) {

    const { Strings, isAuthenticated, logoutSubmitted, loginSubmitted, searchSubmitted, user: { name, facebook: { id } } } = props;

    function onLanguageChange(e) {
        const { setLanguage } = props;
        utils.setCookie('language', e.target.value);
        setLanguage(e.target.value);
    }

    function onLoginClick(user) {
        loginSubmitted(user);
    }

    function getLanguages() {
        return (
            <select
                value={Strings.language}
                className='custom-select n-ch'
                onChange={onLanguageChange}
            >
                <option value='en'>English</option>
                <option value='he'>עברית</option>
            </select>
        );
    }

    return (
        <div className='navbar navbar-default n-header-theme'>
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
                        <img
                            alt='logo'
                            src={logo} width='23'
                            height='23'
                            data-toggle='collapse'
                            data-target='#bs-example-navbar-collapse-1'
                            aria-expanded='false'
                        />
                    </Link>
                </div>

                <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
                    <ul className='nav navbar-nav'>
                        {
                            isAuthenticated ?
                                <li>
                                    <Link
                                        data-toggle='collapse'
                                        data-target='#bs-example-navbar-collapse-1'
                                        aria-expanded='false'
                                        to='/mystreets'
                                    >{Strings.myStreetsTitle}</Link>
                                </li> : null
                        }
                        <li className='n-ch'>{getLanguages()}</li>
                        <li className='n-search-street-header'>
                            <SearchStreet
                                Strings={Strings}
                                searchStreet={searchSubmitted}
                            />
                        </li>
                    </ul>
                    <ul className='n-profile-login nav navbar-nav navbar-right'>
                        {
                            isAuthenticated ?
                                <ProfileButton
                                    Strings={Strings}
                                    logoutSubmitted={logoutSubmitted}
                                    name={name}
                                    id={id}
                                /> :
                                <FacebookLogin
                                    appId={process.env.NODE_ENV === 'production' ? '678252172335402' : '120994491908422'}
                                    scope='user_friends,public_profile,email,user_about_me'
                                    callback={onLoginClick}
                                    cookie={true}
                                    autoLoad={true}
                                    xfbml={true}
                                    version='v2.5'
                                    className='btn n-google-search-btn-search n-ch'
                                    buttonText='Login'
                                />
                        }
                    </ul>
                </div>
            </div>
        </div>
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
