import React, { PropTypes } from 'react';
import { Comment, CommentForm } from 'components/comment';
import { connect } from 'react-redux';
import { replaceDateTime } from 'util/utils.js';
import moment from 'moment';
import './post.scss';

function select(state) {
    const { post: { newComment }, user: { Strings } } = state;

    const comments = [];
    if (newComment.author) {
        const comment = Object.assign({}, newComment);
        comments.unshift(comment);
        newComment.author = null;
    }

    return {
        newComment,
        comments,
        Strings,
    };
}

class Post extends React.Component {

    static propTypes = {
        postContent: PropTypes.shape({
            author: PropTypes.shape({
                name: PropTypes.string,
            }),
            body: PropTypes.string,
            createDate: PropTypes.date,
            comments: PropTypes.array,
        }),
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
        addCommentHandler: PropTypes.func.isRequired,
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
        const { addCommentHandler, postContent: { _id } } = this.props;
        const comments = this.state.comments;
        comments.push(comment);
        addCommentHandler(comment, _id);
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
        const { Strings, postContent: { body, createDate, author, comments } } = this.props;
        const picturePath = `https://graph.facebook.com/${author.facebook.id}/picture?type=normal`;
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
                            <div>
                                <ul className='n-comment-list'>
                                    {comments ? comments.map((comment, i) => <Comment key={i} comment={comment} />) : null}
                                </ul>
                            </div>
                        </div>
                        <div>{
                            this.state.showCommentForm ?
                                <CommentForm
                                    Strings={Strings}
                                    displayWriter={this.displayWriter}
                                    displayComment={this.displayComment}
                                /> : '' }</div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(select, null)(Post);
