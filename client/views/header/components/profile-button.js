import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default function ProfileButton(props) {
    const { name, id } = props;

    return (
        <li className='dropdown'>
            <a
                href='profile'
                className='dropdown-toggle'
                data-toggle='dropdown'
                role='button'
                aria-haspopup='true'
                aria-expanded='false'
            >
                {name ? `Hello ${name}` : 'Login'}
                <span className='caret' />
            </a>
            <ul className='dropdown-menu'>
                <li><Link to={`/user/${id}`}>My Profile</Link></li>
                <li role='separator' className='divider' />
                <li><Link to='/'>Logout</Link></li>
            </ul>
        </li>
    );
}

ProfileButton.propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
};
