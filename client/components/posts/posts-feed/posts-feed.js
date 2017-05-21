import React, { Component, PropTypes } from 'react';
import { addPostSubmitted, addCommentSubmitted } from 'actions/post-action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PostForm, Post } from '../../posts';
import './posts-feed.scss';


function select(state) {
    const { postsfeed: { newPost }, myStreets: { selectedStreet: { postsfeed } } } = state;

    if (newPost.author) {
        const post = Object.assign({}, newPost);
        postsfeed.unshift(post);
        newPost.author = null;
    }

    return {
        newPost,
        postsfeed,
    };
}

class PostsFeed extends Component {
    static propTypes = {
        selectedStreet: PropTypes.shape({
            streetName: PropTypes.string,
            place_id: PropTypes.string,
            location: PropTypes.array,
            members: PropTypes.array,
        }),
        isMember: PropTypes.bool,
        postsfeed: PropTypes.array,
        addPostSubmitted: PropTypes.func.isRequired,
        addCommentSubmitted: PropTypes.func.isRequired,
    }

    getPostsFeed = () => {
        const { addCommentSubmitted, selectedStreet: { postsfeed } } = this.props;

        return postsfeed ?
            postsfeed.map((post, i) => <Post addCommentHandler={addCommentSubmitted} key={i} postContent={post} />) : null;
    }

    addNewPost = (newPost) => {
        const { addPostSubmitted, selectedStreet: { _id } } = this.props;
        addPostSubmitted(newPost, _id);
    }
    render() {
        const { isMember } = this.props;

        return (
            <div>
                <div id='streetResult' className='container' />
                {
                    isMember !== true ?
                        null : <PostForm addNewPost={this.addNewPost} />
                }
                <div>
                    {this.getPostsFeed()}
                </div>
            </div>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ addPostSubmitted, addCommentSubmitted }, dispatch);
}

export default connect(select, matchDispatchToProps)(PostsFeed);
