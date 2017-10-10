import React, { PropTypes } from 'react';
import { Link } from 'react-router';

export default function ProfileButton(props) {
    const { name, id, logoutSubmitted, Strings } = props;

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
                {name ? `${Strings.hello} ${name}` : 'Login'}
                <span className='caret' />
            </a>
            <ul className='dropdown-menu'>
                <li>
                    <Link
                        to={`/user/${id}`}
                        className='hidden-xs'
                    >{Strings.myProfileTitle}
                    </Link>
                    <Link
                        to={`/user/${id}`}
                        className='visible-xs'
                        data-toggle='collapse'
                        data-target='#bs-example-navbar-collapse-1'
                        aria-expanded='false'
                    >{Strings.myProfileTitle}
                    </Link>
                </li>
                <li role='separator' className='divider' />
                <li><a href='/' onClick={logoutSubmitted}>{Strings.logout}</a></li>
            </ul>
        </li>
    );
}

ProfileButton.propTypes = {
    logoutSubmitted: PropTypes.func.isRequired,
    name: PropTypes.string,
    id: PropTypes.string,
};
