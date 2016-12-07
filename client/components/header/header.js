import React from 'react';
import { Link } from 'react-router';
import logo from 'file!./logo2.png';
import './header.scss';

class Header extends React.Component {

    render() {

        return (
            <nav className="navbar navbar-default n-header-theme">
                <div className="container-fluid">

                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="/">
                            <img src={logo} width="23" height="23" alt="React"/>
                        </Link>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li><Link to="/mystreets">My Streets</Link></li>
                            <li><Link to="/">Apartments</Link></li>
                        </ul>

                        <ul className="nav navbar-nav navbar-right">
                            <li><a href="#"></a></li>
                            <li className="dropdown">
                                <a href="profile" className="dropdown-toggle" data-toggle="dropdown" role="button"
                                   aria-haspopup="true" aria-expanded="false">Profile <span
                                    className="caret"></span></a>
                                <ul className="dropdown-menu">
                                    <li><Link to="/">Edit Profile</Link></li>
                                    <li><Link to="/">Settings</Link></li>
                                    <li><Link to="/">Help</Link></li>
                                    <li role="separator" className="divider"></li>
                                    <li><Link to="/">Logout</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )

    }
}

export default Header;
