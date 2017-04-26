import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import './post-form.scss';

export default class PostForm extends React.Component {

    static propTypes = {
        addNewPost: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            image: '',
            filename: '',
            text: Strings.postPlaceholder,
        };

    }

    onSubmitForm = (e) => {
        e.preventDefault();
        const { text, imagepath } = this.refs;
        const { addNewPost } = this.props;
        if (!text.value) {
            return;
        }
        const newPost = {
            text: text.value,
            imageurl: imagepath.value,
        }
        this.refs.text.value = '';
        addNewPost(newPost);

    }

    render() {

        return (
            <div className='panel n-postform-panel'>
                <div className='panel-content'>
                    <form onSubmit={this.onSubmitForm} className='form center-block'>
                        <input
                            type='hidden'
                            ref='imagepath'
                            value={this.state.imageurl}
                        />
                        <div className='panel-body'>
                            <div className='form-group'>
                                <textarea
                                    ref='text'
                                    className='form-control input-lg n-postform-textarea'
                                    placeholder={Strings.postPlaceholder}
                                />
                            </div>
                            <h3>{this.state.filename || ''}</h3>
                        </div>
                        <div className='panel-footer n-postform-footer'>

                            <div className='n-footer-filepicker'>
                                <ul className='pull-left list-inline'>
                                    <li><input
                                        onChange={this.uploadFile}
                                        ref='file'
                                        className='filepicker'
                                        id='file'
                                        type='file'
                                    />
                                    </li>
                                </ul>
                            </div>
                            <div className='n-post-btn-wrapper'>
                                <button
                                    type='submit'
                                    className='btn btn-sm postbutton n-btn-post'
                                >
                                    {Strings.post}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
