import React from 'react';
import { PostForm, Post } from '../posts';
import { connect } from 'react-redux';
import {createPost} from '../../actions/sendPostActions'
import './my-streets.scss';
import { Strings } from '../../resources';
import {bindActionCreators} from 'redux';
import usericon from 'file!../../resources/images/profile.png';


class MyStreets extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            postfeed: [],
            currentWriter: '',
            members: ["Idan","Michael","Daniel"]
        }

        this.updatePostFeed = this.updatePostFeed.bind(this);
    }

    updatePostFeed(newPost) {
        let postfeed = this.state.postfeed;
        postfeed.unshift(newPost);
        this.setState({postfeed: postfeed});
    }

    eachPost(post, i) {
        return (
            <Post key={i} content={post}></Post>
        )
    }

    eachMember(member, i) {
        return (
            <div className="n-mystreet-member">
                <img src={usericon} className="n-comment-user-icon"/>
                <div key={i} className="n-member-name">{member}</div>
            </div>
        )
    }

    render() {

        return (
            <div>
                <div className="col-md-4 col-md-offset-4">
                    <div>
                        <div id="streetResult" className="container"></div>
                        <PostForm updatePostFeed={this.updatePostFeed} createPost={this.createPost}/>
                        <div>{this.state.currentWriter}</div>
                        <div> {this.state.postfeed.map(this.eachPost)} </div>
                    </div>
                </div>
                <div className="panel col-md-2 n-mystreet-group-details">
                    <div>{Strings.memberstitle}</div>
                    <div className="n-mystreet-members-panel">
                        {this.state.members.map(this.eachMember)}
                    </div>
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

function matchDispatchToProps(dispatch){
    return bindActionCreators({createPost: createPost}, dispatch);
}

export default connect(mapStateToProps, {matchDispatchToProps})(MyStreets);
