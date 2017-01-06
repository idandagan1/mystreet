import React from 'react';
import { Link } from 'react-router';
import { Strings } from 'resources';


class ProfileButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }

        this.setLoginText = this.setLoginText.bind(this);

    }

    setLoginText(){
        return this.props.name? `Hello ${this.props.name}` : `Login`;
    }

    render() {

        return (
            <li className="dropdown">
                <a href="profile" className="dropdown-toggle" data-toggle="dropdown" role="button"
                   aria-haspopup="true" aria-expanded="false">{this.setLoginText()} <span
                    className="caret"></span></a>
                <ul className="dropdown-menu">
                    <li><Link to="/user">Edit Profile</Link></li>
                    <li><Link to="/">Settings</Link></li>
                    <li><Link to="/">Help</Link></li>
                    <li role="separator" className="divider"></li>
                    <li><Link to="/">Logout</Link></li>
                </ul>
            </li>
        )

    }
}

export default ProfileButton;
