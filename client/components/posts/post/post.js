import React from 'react';
import Comment from '../../comment/comment';
import { Strings } from '../../../resources';
import './post.scss';

class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showComment: false,
            like: 0
        }

        this.showCommentArea = this.showCommentArea.bind(this);
        this.onCommentClick = this.onCommentClick.bind(this);
        this.onLikeClick = this.onLikeClick.bind(this);
    }

    showCommentArea() {
        if (this.state.showComment) {
            return <Comment/>
        }
    }

    onCommentClick() {
        this.setState({showComment: true});
    }

    onLikeClick() {

    }

    render() {

        return (
            <div className="panel n-postform-panel">
                <div className="panel-content">
                    <form onSubmit={this.onSubmit} className="form center-block">
                        <div className="panel-body">

                            <div className="form-group">
                                {this.props.content.text}
                            </div>

                        </div>
                        <div className="panel-footer n-post-footer">
                            <div>
                                <ol className="pull-left list-inline">
                                    <li>
                                        <div className="n-footer-btn" onClick={this.onLikeClick}>{Strings.like}</div>
                                    </li>
                                    <li>
                                        <div className="n-footer-btn"
                                             onClick={this.onCommentClick}>{Strings.comment}</div>
                                    </li>
                                </ol>
                            </div>
                        </div>
                        <div>{ this.state.showComment ? <Comment /> : '' }</div>
                    </form>

                </div>

            </div>
        )

    }
}

export default Post;