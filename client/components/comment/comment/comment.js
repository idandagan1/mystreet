import React, { Component, PropTypes } from 'react';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import './comment.scss';

export default class Comment extends Component {

    static propTypes = {
        comment: PropTypes.shape({
            username: PropTypes.string,
            content: PropTypes.string,
        }),
    };

    render() {
        const { comment, comment: { username, content } } = this.props;
        return (
        comment ?
            <div>
                <img src={usericon} alt='' className='n-comment-user-icon' />
                <div className='n-comment-body'>
                    <div>
                        <div className='n-comment-username'>
                            {username}
                        </div>
                        <div className='n-comment-wrapper'>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
     : null);
    }
}
