import React, { PropTypes } from 'react';
import './comment-form.scss';

class CommentForm extends React.Component {

    static propTypes = {
        displayWriter: PropTypes.func,
        submitComment: PropTypes.func,
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
        this.state = {
            username: '',
        };
    }

    onCommentSubmit = () => {
        const { submitComment } = this.props;
        const comment = {
            body: this.comment.value,
        };

        submitComment(comment);
        this.comment.value = '';
    }

    onChange = () => {
        const { displayWriter } = this.props;
        const { username } = this.state;
        displayWriter(username);
    }

    render() {
        const { Strings } = this.props;
        return (
            <div className='panel-footer n-comment-footer'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='input-group' >
                            <input
                                type='text'
                                className='form-control'
                                ref={comment => { this.comment = comment; }}
                                placeholder={Strings.writeComment}
                                required={true}
                            />
                            <span className='input-group-btn' >
                                <button
                                    className='btn btn-default'
                                    onClick={this.onCommentSubmit}
                                    type='button'
                                >{Strings.comment}</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommentForm;
