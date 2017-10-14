import React, { PropTypes } from 'react';


export default function Member(props) {

    const { member, i, userSelected } = props;
    const { facebook: { id, first_name, last_name } } = member;
    const picturePath = `https://graph.facebook.com/${id}/picture?type=normal`;

    return (
        <li style={{ height: 42 }} key={i}>
            <div className='po dropdown show'>
                <a className='n-post-user' id='dropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                    <img className='n-comment-user-icon' alt='user-icon' src={picturePath} role='img' />
                    <div style={{ height: 8 }} />
                    <div className='n-street-name col-xs-12'>{`${first_name} ${last_name}`}</div>
                    <span className='caret' />
                </a>

                <ul className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
                    <li>
                        <a onClick={() => { userSelected(id); }}>Go To Profile</a>
                    </li>
                    <li><a className='dropdown-item' href='' data-toggle='modal' data-target='#myModal'>Report</a></li>
                </ul>
            </div>
        </li>
    );
}

Member.propTypes = {
    member: PropTypes.shape({
        facebook: PropTypes.shape({
            id: PropTypes.string,
        }),
        name: PropTypes.string,
    }),
    i: PropTypes.number,
    userSelected: PropTypes.func.isRequired,
}
