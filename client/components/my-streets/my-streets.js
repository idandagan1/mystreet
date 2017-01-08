import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PostForm, Post } from 'components/posts';
import Map from 'components/map/map';
import { createPost } from 'actions/post-action-creators';
import { Strings } from 'resources';
import usericon from 'resources/images/profile.png';
import './my-streets.scss';


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
            <div className="n-mystreet-member" key={i}>
                <img src={usericon} className="n-comment-user-icon"/>
                <div key={i} className="n-member-name">{member}</div>
            </div>
        )
    }

    render() {

        return (
            <div className="n-mystreet-mainContainer">
                <ol className="list-inline">
                    <li className="n-mystreet-leftCol col-md-3">
                        <Map></Map>
                    </li>
                    <li className="n-mystreet-content col-md-4">
                        <div className="">
                            <div>
                                <div id="streetResult" className="container"></div>
                                <PostForm updatePostFeed={this.updatePostFeed} createPost={this.createPost}/>
                                <div>{this.state.currentWriter}</div>
                                <div> {this.state.postfeed.map(this.eachPost)} </div>
                            </div>
                        </div>
                    </li>
                    <li className="col-md-2">
                        <div className="panel n-mystreet-group-details">
                            <div>{Strings.memberstitle}</div>
                            <div className="n-mystreet-members-panel">
                                {this.state.members.map(this.eachMember)}
                            </div>
                        </div>
                    </li>
                </ol>
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
