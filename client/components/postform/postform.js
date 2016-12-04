import React from 'react';
import { Link } from 'react-router';
import './post.scss';

class PostForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            image:'',
            filename:''
        }

    }

    submitForm(e){
        e.preventDefault();
        var that = this;
        var message = this.refs.sharing.value;
        var imageurl = this.refs.imagepath.value;
        this.setState({filename:''});
        this.resetFields();


    }

    render() {

        return (
            <div className="panel n-postform-panel">
                <div className="panel-content">
                    <form onSubmit={this.submitForm} className="form center-block">
                        <input type="hidden" ref="imagepath" value={this.state.imageurl}/>
                        <div className="panel-body">
                            <div className="form-group">
                                <textarea ref="sharing" className="form-control input-lg"
                                          placeholder="What's on your mind?"></textarea>
                            </div>
                            <h3>{this.state.filename||''}</h3>
                        </div>
                        <div className="panel-footer">
                            <div>
                                <ul className="pull-left list-inline">
                                    <li><input onChange={this.uploadFile} ref="file" className='filepicker' id="file" type="file"/></li>
                                </ul>
                                <button type="submit" className="btn btn-sm postbutton n-btn-post">Post</button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        )

    }
}

export default PostForm;