import React, { PropTypes } from 'react';
import { Comment, CommentForm } from 'components/comment';
import { Strings } from 'resources';
import { replaceDateTime } from 'util/utils.js';
import commenticon from 'resources/images/comment-icon.png';
import likeicon from 'resources/images/like-icon.png';
import moment from 'moment';
import './post.scss';

class Post extends React.Component {

    static propTypes = {
        postContent: PropTypes.shape({
            author: PropTypes.shape({
                name: PropTypes.string,
            }),
            body: PropTypes.string,
            createDate: PropTypes.date,
        }),
    }

    constructor(props) {
        super(props);
        const { postContent: { createDate, _id } } = props;
        const formattedDate = this.getFormattedDate(createDate);

        this.state = {
            showCommentForm: false,
            isWritting: false,
            writer: '',
            likes: [],
            comments: [],
            updateDateTime: true,
        };
    }

    showCommentArea = () => {
        const { showCommentForm } = this.state;
        return showCommentForm ? <CommentForm /> : null;
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    componentDidMount = () => {
        this.interval = setInterval(this.updatePostDate, 60000);
    }

    onCommentClick = () => {
        this.setState({ showCommentForm: !this.state.showCommentForm });
    }

    displayComment = (comment) => {
        const comments = this.state.comments;
        comments.push(comment);
        this.setState({ comments });
    }

    updatePostDate = () => {
        const { updateDateTime } = this.state;
        this.setState({ updateDateTime: !updateDateTime });
    }

    getFormattedDate = (createDate) => {
        const fDate = moment().from(createDate);
        return replaceDateTime(fDate);
    }

    onLikeClick = () => {
        const likes = this.state.likes;
        likes.push(this.state.username);
        this.setState({ likes });
    }

    getComments = () => {
        const { comments } = this.state;
        return comments.length !== 0 ?
        (
            <div>
                <img src={commenticon} className='n-reactions-icon' />
                <div className='n-post-reactions'>{this.state.comments.length}</div>
            </div>
        ) : null;

    }

    getLikes = () => {

        const { likes } = this.state;
        return likes.length !== 0 ?
            (
                <div>
                    <img src={likeicon} className='n-reactions-icon' />
                    <div className='n-post-reactions'>{this.state.likes.length}</div>
                </div>
            ) : null;
    }

    displayPostReactions = () => {

        const comments = this.getComments();
        const likes = this.getLikes();

        return (!likes && !comments) ?
            <div>{Strings.emptyLikes}</div>
            :
            <div>
                <ol className='list-inline'>
                    <li>{likes}</li>
                    <li>{comments}</li>
                </ol>
                <hr />
            </div>;
    }

    displayWriter = (username) => {
        if (username && !this.state.isWritting) {
            const msg = username.concat(' is typing...');
            this.setState({ writer: msg, isWritting: true });
            setTimeout(() => {
                this.setState({ writer: '', isWritting: false });
            }, 1000);
        }
    }

    render() {
        const { postContent: { body, createDate, author } } = this.props;
        const { formattedDate } = this.state;
        const picturePath = `http://graph.facebook.com/${author.facebook.id}/picture?type=normal`;
        const linkToUserFacebook = `https://www.facebook.com/app_scoped_user_id/${author.facebook.id}`;

        return (
            <div className='panel n-postform-panel'>
                <div className='panel-content'>
                    <form onSubmit={this.onSubmit} className='form center-block'>
                        <div className='panel-body n-post-body'>
                            <div className='n-post-header row'>
                                <div >
                                    <img alt='user-icon' className='n-post-user-icon' src={picturePath} />
                                </div>
                                <div>
                                    <a className='n-post-user' rel='noopener noreferrer' target='_blank' href={linkToUserFacebook}>
                                        {author.name}
                                    </a>
                                    <div className='n-post-date'>{this.getFormattedDate(createDate)}</div>
                                </div>
                            </div>
                            <hr />
                            <div className='form-group'>
                                {body}
                            </div>
                            <hr />
                            <ol className='pull-left list-inline'>
                                <li>
                                    <div>
                                        <div className='n-footer-btn' onClick={this.onLikeClick}>{Strings.like}</div>
                                    </div>
                                </li>
                                <li>
                                    <div>
                                        <div
                                            className='n-footer-btn'
                                            onClick={this.onCommentClick}
                                        >{Strings.comment}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className='typing'>{this.state.writer}</div>
                                </li>
                            </ol>
                        </div>
                        <div className='panel-footer n-post-footer'>
                            <div className='n-text-12'>{this.displayPostReactions()}</div>
                            <div> {this.state.comments.map((comment, i) => <Comment key={i} comment={comment} />)} </div>
                        </div>
                        <div>{
                            this.state.showCommentForm ?
                                <CommentForm
                                    displayWriter={this.displayWriter}
                                    displayComment={this.displayComment}
                                /> : '' }</div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Post;
