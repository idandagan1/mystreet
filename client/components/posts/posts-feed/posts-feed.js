import React, { Component, PropTypes } from 'react';
import { addPostSubmitted } from 'actions/post-action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PostForm, Post } from '../../posts';
import './posts-feed.scss';


function select(state) {
    const { posts: { newPost, postsfeed } } = state;

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
    }

    addNewPost = (newPost) => {
        const { addPostSubmitted, selectedStreet: { _id } } = this.props;

        addPostSubmitted(newPost, _id);
    }
    render() {
        const { isMember, postsfeed } = this.props;

        return (
            <div>
                <div id='streetResult' className='container' />
                {
                    isMember !== true ?
                        null : <PostForm addNewPost={this.addNewPost} />
                }
                <div>
                    {postsfeed ? postsfeed.map((post, i) => <Post key={i} postContent={post} />)
                : null}
                </div>
            </div>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ addPostSubmitted }, dispatch);
}

export default connect(select, matchDispatchToProps)(PostsFeed);
