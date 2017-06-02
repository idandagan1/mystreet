import React, { Component, PropTypes } from 'react';
import { addPostSubmitted, addCommentSubmitted } from 'actions/post-action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PostForm, Post } from '../../posts';
import './posts-feed.scss';


function select(state) {
    const { postsfeed: { postsfeed } } = state;

    return {
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
        username: PropTypes.string,
    }

    getPostsFeed = () => {
        const { addCommentSubmitted, postsfeed } = this.props;

        return postsfeed ?
            postsfeed.map((post, i) => <Post addCommentHandler={addCommentSubmitted} key={i} postContent={post} />) : null;
    }

    addNewPost = (newPost) => {
        const { addPostSubmitted, selectedStreet: { _id } } = this.props;
        addPostSubmitted(newPost, _id);
    }

    render() {
        const { isMember, username } = this.props;

        return (
            <div>
                <div id='streetResult' className='container' />
                {
                    isMember !== true ?
                        null : <PostForm username={username} addNewPost={this.addNewPost} />
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
