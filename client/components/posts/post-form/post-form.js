import React from 'react';
import { Strings } from 'resources';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createPost } from 'actions/post-action-creators';
import './post-form.scss';

class PostForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            image: '',
            filename: '',
            text: Strings.postPlaceholder
        }

        this.onSubmit = this.onSubmit.bind(this);

    }

    onSubmit(e) {
        e.preventDefault();
        const text = this.refs.text.value;
        if (!text) {
            return;
        }

        const newPost = {
            text,
            imageurl: this.refs.imagepath.value
        }

        this.setState({filename: '',});
        this.refs.text.value = '';
        this.props.createPost(newPost);
        this.props.updatePostFeed(newPost);

    }

    render() {

        return (
            <div className="panel n-postform-panel">
                <div className="panel-content">
                    <form onSubmit={this.onSubmit} className="form center-block">
                        <input type="hidden" ref="imagepath" value={this.state.imageurl}/>
                        <div className="panel-body">
                            <div className="form-group">
                                <textarea ref="text" className="form-control input-lg n-postform-textarea"
                                          placeholder={Strings.postPlaceholder}></textarea>
                            </div>
                            <h3>{this.state.filename || ''}</h3>
                        </div>
                        <div className="panel-footer n-postform-footer">

                            <div className="n-footer-filepicker">
                                <ul className="pull-left list-inline">
                                    <li><input onChange={this.uploadFile} ref="file" className='filepicker' id="file"
                                               type="file"/></li>
                                </ul>
                            </div>
                            <div className="n-post-btn-wrapper">
                                <button type="submit"
                                        className="btn btn-sm postbutton n-btn-post">{Strings.post}</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        )

    }
}

function mapStateToProps(state) {
    return {
        lastPost: state.lastPost
    };
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({createPost: createPost}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PostForm);
