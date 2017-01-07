import React from 'react';
import { Link } from 'react-router';
import logo from './logo2.png';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { facebookLoginSucceeded } from 'actions/userActions';
import FacebookLogin from 'components/facebook/facebook-button';
import ProfileButton from './profile-button';
import './header.scss';


class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            isLoggedIn: false
        };

        this.responseFacebook = this.responseFacebook.bind(this);
    }

    responseFacebook(response) {
        if (response) {
            this.setState({
                name: response.name,
                isLoggedIn: true
            });

            this.props.facebookLoginSucceeded(response);
        }
    }

    render() {

        const isLoggedIn = this.state.isLoggedIn;

        let button = null;

        if (isLoggedIn) {
            button = <ProfileButton name={this.state.name} />;
        } else {
            button = <FacebookLogin
                appId="678252172335402"
                isLoggedIn = {this.state.isLoggedIn}
                callback={this.responseFacebook}
            >Login</FacebookLogin>;
        }

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
                            <img src={logo} width="23" height="23"/>
                        </Link>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li><Link to="/mystreets">My Streets</Link></li>
                            <li><Link to="/">Apartments</Link></li>
                        </ul>

                        <ul className="nav navbar-nav navbar-right">
                            {button}
                        </ul>
                    </div>
                </div>
            </nav>
        )

    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({ facebookLoginSucceeded }, dispatch);
}

export default connect(null, matchDispatchToProps)(Header);

