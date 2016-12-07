import React from 'react';
import './comment.scss';
import { Strings } from '../../resources';

class Comment extends React.Component {

    constructor(props) {
        super(props);
        this.onCommentClick = this.onCommentClick.bind(this);
    }

    onCommentClick() {
        this.refs.comment.value = '';
    }

    render() {

        return (

            <div className="panel-footer n-comment-footer">
                <div className="">
                    <textarea ref="comment" className="form-control input-lg n-comment-textarea"
                              placeholder={Strings.writeComment}></textarea>
                </div>
                <div className="n-comment-footer">
                    <ol className="pull-left list-inline">
                        <li>
                            <div className="n-comment-btn">{Strings.like}</div>
                        </li>
                        <li>
                            <div onClick={this.onCommentClick} className="n-comment-btn">{Strings.comment}</div>
                        </li>
                    </ol>
                </div>
            </div>
        )
    }
}

export default Comment;
