import React, { PropTypes } from 'react';
import { Comment, CommentForm } from 'components/comment';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
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
        this.state = {
            showCommentForm: false,
            username: 'Idan Dagan',
            isWritting: false,
            writer: '',
            likes: [],
            comments: [],
            createDate: moment(),
            when: '',
        }
    }

    showCommentArea = () => {
        if (this.state.showCommentForm) {
            return <CommentForm />
        }
    }

    showDateTime = (date) => {
        const when = moment(date).format('MM/DD/YYYY');
        return when;
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    componentDidMount = () => {
        const when = this.getPostTime();
        this.setState({when});
        this.interval = setInterval(this.updateDateTime, 60000);
    }

    onCommentClick = () =>{
        this.setState({showCommentForm: !this.state.showCommentForm});
    }

    displayComment = (comment) =>{

        let comments = this.state.comments;
        comments.push(comment);
        this.setState({comments});
    }

    eachComment = (comment, i) => {

        return (
            <Comment key={i} comment={comment}></Comment>
        )
    }

    getPostTime = () => {
        let str = this.state.createDate.fromNow();
        str = str.replace('a few seconds ago', 'just now');
        str = str.replace('minutes ago', 'mins');
        const when = str.replace('hours ago', 'hrs');
        return when;
    }

    onLikeClick = () => {
        let likes = this.state.likes;
        likes.push(this.state.username);
        this.setState({likes})
    }

    getComments = () => {
        if (this.state.comments.length !== 0) {
            return ( <div>
                    <img src={commenticon} className='n-reactions-icon'/>
                    <div className='n-post-reactions'>{this.state.comments.length}</div>
                </div>
            )
        } else {
            return null;
        }
    }

    getLikes = () => {
        if (this.state.likes.length !== 0) {
            return ( <div>
                    <img src={likeicon} className='n-reactions-icon'/>
                    <div className='n-post-reactions'>{this.state.likes.length}</div>
                </div>
            )
        } else {
            return null;
        }
    }

    displayPostReactions = () =>{

        const comments = this.getComments();
        const likes = this.getLikes();

        if (!likes && !comments) {
            return (
                <div>{Strings.emptyLikes}</div>
            )
        } else {
            return (
                <div>
                    <ol className='list-inline'>
                        <li>{likes}</li>
                        <li>{comments}</li>
                    </ol>
                    <hr/>
                </div>
            )
        }
    }

    displayWriter = (username) => {
        if (username && !this.state.isWritting) {
            const msg = username + ' is typing...';
            this.setState({writer: msg, isWritting: true});
            setTimeout(()=> {
                this.setState({writer: '', isWritting: false})
            }, 1000);
        }
    }

    render() {
        const { postContent: { body, createDate, author } } = this.props;
        const picturePath = `http://graph.facebook.com/${author.facebook.id}/picture?type=normal`;

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
                                    <div className='n-post-user'>{author.name}</div>
                                    <div className='n-post-date'>{this.showDateTime(createDate)}</div>
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

                                        <div className='n-footer-btn'
                                             onClick={this.onCommentClick}>{Strings.comment}</div>
                                    </div>
                                </li>
                                <li>
                                    <div className='typing'>{this.state.writer}</div>
                                </li>
                            </ol>
                        </div>
                        <div className='panel-footer n-post-footer'>
                            <div className='n-text-12'>{this.displayPostReactions()}</div>
                            <div> {this.state.comments.map(this.eachComment)} </div>
                        </div>
                        <div>{ this.state.showCommentForm ? <CommentForm displayWriter={this.displayWriter}
                                                                 displayComment={this.displayComment}/> : '' }</div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Post;
