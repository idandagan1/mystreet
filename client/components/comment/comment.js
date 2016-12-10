import React from 'react';
import { Link } from 'react-router';
import './comment.scss';
import { Strings } from '../../resources';

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'Idan'
        }

        this.onCommentClick = this.onCommentClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onCommentClick() {
        const comment = {
            username: this.state.username,
            content: this.refs.comment.value
        }
        if(comment) {
            this.props.displayComment(comment);
            this.refs.comment.value = '';
        }
    }

    onChange() {
        this.props.displayWriter(this.state.username);
    }

    render() {

        return (

            <div className="panel-footer n-comment-footer">
                <div className="">
                    <textarea onChange={this.onChange} ref="comment" className="form-control input-lg n-comment-textarea"
                              placeholder={Strings.writeComment}></textarea>
                    <div onClick={this.onCommentClick} className="btn btn-sm n-btn-comment">{Strings.comment}</div>
                </div>
            </div>
        )
    }
}

export default Comment;
