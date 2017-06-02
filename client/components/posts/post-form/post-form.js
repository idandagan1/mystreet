import React, { PropTypes } from 'react';
import { Strings } from 'resources';
import moment from 'moment';
import './post-form.scss';

export default class PostForm extends React.Component {

    static propTypes = {
        addNewPost: PropTypes.func.isRequired,
        username: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {
            image: '',
            filepath: '',
            body: Strings.postPlaceholder,
        };

    }

    onSubmitForm = (e) => {
        e.preventDefault();
        const { addNewPost } = this.props;

        const newPost = {
            body: this.formfield.value,
            createDate: moment(),
            comment: [],
            imageurl: this.imagepath.value,
        }
        this.formfield.value = '';
        addNewPost(newPost);

    }

    render() {
        const { filepath } = this.state;
        const { username } = this.props;
        return (
            <div className='panel'>
                <div className='panel-content'>
                    <form onSubmit={this.onSubmitForm} className='form center-block'>
                        <input
                            type='hidden'
                            ref={imagepath => { this.imagepath = imagepath; }}
                            value={this.state.imageurl}
                        />
                        <div className='panel-body'>
                            <div className='form-group'>
                                <textarea
                                    ref={formfield => { this.formfield = formfield; }}
                                    className='form-control input-lg n-postform-textarea'
                                    placeholder={Strings.postPlaceholder+username}
                                    required='true'
                                />
                            </div>
                            <h3>{filepath}</h3>
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
