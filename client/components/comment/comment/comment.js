import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import moment from 'moment';
import './comment.scss';

export default function Comment(props) {

    const { i, comment: { author, createDate, body } } = props;
    const formattedDate = moment(createDate).format('MM/DD/YYYY');
    const picturePath = `http://graph.facebook.com/${author.facebook.id}/picture?type=normal`;
    const linkToUserFacebook = `https://www.facebook.com/app_scoped_user_id/${author.facebook.id}`;

    return (
        <li style={{ height: 42 }} key={i}>
            <div className='po dropdown show'>
                <a
                    className='n-post-user'
                    rel='noopener noreferrer'
                    target='_blank'
                    href={linkToUserFacebook}
                >
                    <img className='n-comment-user-icon' alt='user-icon' src={picturePath} />
                    <span>{author.name} </span>
                </a>
                <span className='n-comment-date'>{formattedDate}</span>
            </div>
            <span>{body}</span>
        </li>
    );
}

Comment.propTypes = {
    comment: PropTypes.shape({
        body: PropTypes.string,
        createDate: PropTypes.date,
        author: PropTypes.shape({
            facebook: PropTypes.shape({
                id: PropTypes.string,
            }),
            name: PropTypes.string,
        }),
    }),
    i: PropTypes.number,
}

