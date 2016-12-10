import React from 'react';
import Comment from '../../comment/comment';
import { Strings } from '../../../resources';
import usericon from 'file!../../../resources/images/profile.png';
import commenticon from 'file!../../../resources/images/comment-icon.png';
import likeicon from 'file!../../../resources/images/like-icon.png';
import Moment from 'moment';
import './post.scss';

class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showComment: false,
            username: 'Idan Dagan',
            isWritting:false,
            writer:'',
            likes: [],
            comments: [],
            createDate: Moment(),
            when: ''
        }

        this.showCommentArea = this.showCommentArea.bind(this);
        this.onCommentClick = this.onCommentClick.bind(this);
        this.onLikeClick = this.onLikeClick.bind(this);
        this.displayWriter = this.displayWriter.bind(this);
        this.getPostTime = this.getPostTime.bind(this);
        this.displayPostReactions = this.displayPostReactions.bind(this);
        this.displayComment = this.displayComment.bind(this);
    }

    showCommentArea() {
        if (this.state.showComment) {
            return <Comment/>
        }
    }
    updateDateTime() {
        const when = this.getPostTime();
        this.setState({when});
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        const when = this.getPostTime();
        this.setState({when});
        this.interval = setInterval(this.updateDateTime.bind(this), 60000);
    }

    onCommentClick() {
        this.setState({showComment: true});
    }

    displayComment(comment){

        let comments = this.state.comments;
        comments.push(comment);
        this.setState({comments});
    }

    eachComment(comment, i) {
        return (
            <div key={i}>
                <img src={usericon} className="n-comment-user-icon"/>
                <div className="n-comment-body">
                    <div>
                        <div className="n-comment-username">
                            {comment.username}
                        </div>
                        <div className="n-comment-wrapper" key={i}>
                            {comment.content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getPostTime() {
        let str = this.state.createDate.fromNow();
        str = str.replace("a few seconds ago", "just now");
        str = str.replace("minutes ago", "mins");
        const when = str.replace("hours ago", "hrs");
        return when;
    }

    onLikeClick() {
        let likes = this.state.likes;
        likes.push(this.state.username);
        this.setState({likes})
    }

    getComments() {
        if (this.state.comments.length !== 0) {
            return ( <div>
                    <img src={commenticon} className="n-reactions-icon"/>
                    <div className="n-post-reactions">{this.state.comments.length}</div>
                </div>
            )
        }else{
            return null;
        }
    }

    getLikes() {
        if (this.state.likes.length !== 0) {
            return ( <div>
                    <img src={likeicon} className="n-reactions-icon"/>
                    <div className="n-post-reactions">{this.state.likes.length}</div>
                </div>
            )
        }else{
            return null;
        }
    }

    displayPostReactions() {

        const comments = this.getComments();
        const likes = this.getLikes();

        if (!likes && !comments) {
            return (
                <div>{Strings.emptyLikes}</div>
            )
        } else {
            return (
                <div>
                    <ol className="list-inline">
                        <li>{likes}</li>
                        <li>{comments}</li>
                    </ol>
                    <hr/>
                </div>
            )
        }
    }

    displayWriter(username){
        if(username && !this.state.isWritting) {
            const msg = username + " is typing...";
            this.setState({writer: msg, isWritting:true});
            setTimeout(()=> {
                this.setState({writer: '', isWritting: false})
            }, 2000);
        }
    }

    render() {

        return (
            <div className="panel n-postform-panel">
                <div className="panel-content">
                    <form onSubmit={this.onSubmit} className="form center-block">
                        <div className="panel-body n-post-body">
                            <div className="n-post-header row">
                                <div >
                                    <img  className="n-post-user-icon" src={usericon}/>
                                </div>
                                <div>
                                    <div className="n-post-user">{this.state.username}</div>
                                    <div className="n-post-date">{this.state.when}</div>
                                </div>
                            </div>
                            <hr/>
                            <div className="form-group">
                                {this.props.content.text}
                            </div>
                            <hr/>
                            <ol className="pull-left list-inline">
                                <li>
                                    <div>
                                        <div className="n-footer-btn" onClick={this.onLikeClick}>{Strings.like}</div>
                                    </div>
                                </li>
                                <li>
                                    <div>

                                        <div className="n-footer-btn"
                                             onClick={this.onCommentClick}>{Strings.comment}</div>
                                    </div>
                                </li>
                                <li><div className="typing">{this.state.writer}</div></li>
                            </ol>
                        </div>
                        <div className="panel-footer n-post-footer">
                            <div className="n-text-12">{this.displayPostReactions()}</div>
                            <div> {this.state.comments.map(this.eachComment)} </div>
                        </div>
                        <div>{ this.state.showComment ? <Comment displayWriter={this.displayWriter} displayComment={this.displayComment}/> : '' }</div>
                    </form>
                </div>
            </div>
        )
    }
}

export default Post;
