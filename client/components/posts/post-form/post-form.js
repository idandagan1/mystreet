import React, { PropTypes } from 'react';
import moment from 'moment';
import { FileLoader } from 'components';
import superagent from 'superagent';
import './post-form.scss';

export default class PostForm extends React.Component {

    static propTypes = {
        addNewPost: PropTypes.func.isRequired,
        username: PropTypes.string,
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
    }

    constructor(props) {
        super(props);
        const { Strings } = props;
        this.state = {
            url: '',
            params: {},
            image: '',
            body: Strings.postPlaceholder,
        };
    }

    onFileUpload = (url, params, image) => {
        this.setState({
            url,
            params,
            image,
        });
    }

    onSubmitForm = (e) => {
        e.preventDefault();
        document.body.classList.add('uploadImg');
        const { url, params, image } = this.state;

        if (!url || !params || !image) {
            this.submitPost();
            return;
        }

        this.submitImage(url, params, image);

    }

    submitImage(url, params, image) {
        const uploadRequest = superagent.post(url);
        uploadRequest.attach('file', image);

        Object.keys(params).forEach((key) => {
            uploadRequest.field(key, params[key]);
        });

        uploadRequest.end((err, resp) => {
            if (err) {
                console.log('error while uploading image');
                alert('unable to upload photo, please try again later');
                this.cleanInputs();
                return;
            }
            this.submitPost(resp.body.secure_url);
        });
    }

    submitPost(imageUrl) {
        const { addNewPost } = this.props;
        const newPost = {
            body: this.formfield.value,
            createDate: moment(),
            comment: [],
            imageUrl,
        }

        addNewPost(newPost);
        this.cleanInputs();
    }

    cleanInputs() {
        this.formfield.value = '';
        document.getElementById('fileInputId').value = '';
        document.body.classList.remove('uploadImg');
        this.setState({
            url: '',
            params: {},
            image: '',
        });
    }

    render() {
        const { username, Strings } = this.props;
        return (
            <div className='panel'>
                <div className='panel-content'>
                    <form onSubmit={this.onSubmitForm} className='form center-block'>
                        <input
                            type='hidden'
                            ref={imagepath => { this.imagepath = imagepath; }}
                            value={this.state.imageurl}
                        />
                        <div className='panel-body n-post-form'>
                            <div className='form-group'>
                                <textarea
                                    ref={formfield => { this.formfield = formfield; }}
                                    className='form-control input-lg n-postform-textarea'
                                    placeholder={Strings.postPlaceholder + username}
                                    required='true'
                                />
                            </div>
                        </div>
                        <div className='panel-footer n-postform-footer'>
                            <div className='n-footer-filepicker'>
                                <ul className='pull-left list-inline'>
                                    <li>
                                        <FileLoader onFileUpload={this.onFileUpload} />
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
        );
    }
}
