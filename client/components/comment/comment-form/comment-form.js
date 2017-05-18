import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import './comment-form.scss';

class CommentForm extends React.Component {

    static propTypes = {
        displayWriter: PropTypes.func,
        displayComment: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
        };
    }

    onCommentClick = () => {
        const { username } = this.state;
        const { displayComment } = this.props;
        const comment = {
            username,
            content: this.comment.value,
        }
        if (comment) {
            displayComment(comment);
            this.comment.value = '';
        }
    }

    onChange = () => {
        const { displayWriter } = this.props;
        const { username } = this.state;
        displayWriter(username);
    }

    render() {

        return (

            <div className='panel-footer n-comment-footer'>
                <div>
                    <textarea
                        onChange={this.onChange}
                        ref={comment => { this.comment = comment; }}
                        className='form-control input-lg n-comment-textarea'
                        placeholder={Strings.writeComment}
                    ></textarea>
                    <div onClick={this.onCommentClick} className='btn btn-sm n-btn-comment'>{Strings.comment}</div>
                </div>
            </div>
        );
    }
}

export default CommentForm;
