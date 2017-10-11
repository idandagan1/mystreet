import React, { PropTypes } from 'react';
import { Comment, CommentForm } from 'components/comment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { replaceDateTime } from 'util/utils.js';
import moment from 'moment';
import { deletePost } from 'actions/post-action-creators';
import './post.scss';

function select(state) {
    const { user: { Strings, activeUser } } = state;

    return {
        Strings,
        activeUser,
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
            imageUrl: PropTypes.string,
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

    componentWillReceiveProps = (props, newprops) => {
        const { postContent: { comments } } = props;
        this.setState({ comments });
    }

    onCommentClick = () => {
        this.setState({ showCommentForm: !this.state.showCommentForm });
    }

    onSubmitComment = (comment) => {
        const { activeUser, addCommentHandler, postContent: { _id } } = this.props;
        const { comments } = this.state;
        const newComment = {
            date: Date.now(),
            author: activeUser,
            body: comment.body,
        }

        comments.push(newComment);
        addCommentHandler(newComment, _id, activeUser._id);
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

    isAuthor(authorId) {
        const { activeUser: { _id } } = this.props;
        return authorId === _id;
    }

    onDeletePost(id) {
        const { deletePost } = this.props;
        deletePost(id);
    }

    render() {
        const { Strings, postContent: { _id, body, createDate, author, imageUrl } } = this.props;
        const { comments } = this.state;
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
                                <div style={{ display: 'inline-block' }}>
                                    <a className='n-post-user' rel='noopener noreferrer' target='_blank' href={linkToUserFacebook}>
                                        {author.name}
                                    </a>
                                    <div className='n-post-date'>{this.getFormattedDate(createDate)}</div>
                                </div>
                                {
                                    this.isAuthor(author._id) ?
                                        <div className='dropdown show street-caret pull-right po'>
                                            <a
                                                className='n-post-user'
                                                id='dropdownMenuLink'
                                                data-toggle='dropdown'
                                                aria-haspopup='true'
                                                aria-expanded='false'
                                            >
                                                <span className='caret' />
                                            </a>
                                            <ul
                                                className='dropdown-menu'
                                                aria-labelledby='dropdownMenuLink'
                                            >
                                                <li>
                                                    <span
                                                        className='n-mystreet-street-item'
                                                        onClick={() => this.onDeletePost(_id)}
                                                    >{Strings.deletePost}</span>
                                                </li>
                                            </ul>
                                        </div> : null
                                }
                            </div>
                            <hr />
                            <div className='form-group'>
                                <span>{body}</span>
                                {
                                    imageUrl ?
                                        <img
                                            src={imageUrl}
                                            alt='post-img'
                                            className='img-responsive n-post-img'
                                        /> : null
                                }
                            </div>
                            <hr />
                            <ul className='pull-left list-inline'>
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
                            </ul>
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
                                    submitComment={this.onSubmitComment}
                                /> : '' }</div>
                    </form>
                </div>
            </div>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ deletePost }, dispatch);
}

export default connect(select, matchDispatchToProps)(Post);
