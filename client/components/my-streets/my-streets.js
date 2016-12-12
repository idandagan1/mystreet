import React from 'react';
import SearchStreet from '../search-street/search-street';
import { PostForm, Post } from '../posts';
import { searchStreet } from '../../actions/searchActions';
import { connect } from 'react-redux';
import {createPost} from '../../actions/sendPostActions'
import './my-streets.scss';
import {bindActionCreators} from 'redux';


class MyStreets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postfeed: [],
            currentWriter: ''
        }

        this.updatePostFeed = this.updatePostFeed.bind(this);
    }

    updatePostFeed(newPost) {
        let postfeed = this.state.postfeed;
        postfeed.unshift(newPost);
        this.setState({postfeed: postfeed});
    }

    getWriter(user) {
        if (!user) {
            this.setState({currentWriter: user});
        }
    }

    eachPost(post, i) {
        return (
            <Post key={i} content={post}></Post>
        )
    }

    render() {

        return (
            <div className="col-md-4 col-md-offset-4">
                <div id="streetResult" className="container"></div>
                <PostForm updatePostFeed={this.updatePostFeed} createPost={this.createPost}/>
                <div>{this.state.currentWriter}</div>
                <div> {this.state.postfeed.map(this.eachPost)} </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        lastPost: state.lastPost
    };
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({createPost: createPost}, dispatch);
}

export default connect(mapStateToProps, {matchDispatchToProps})(MyStreets);
