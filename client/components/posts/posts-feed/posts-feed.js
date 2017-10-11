import React, { Component, PropTypes } from 'react';
import { addPostSubmitted, addCommentSubmitted, getPostsByPlaceId } from 'actions/post-action-creators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PostForm, Post } from '../../posts';
import './posts-feed.scss';


function select(state) {
    const { postsfeed: { postsfeed }, user: { Strings } } = state;
    return {
        postsfeed,
        Strings,
    };
}

class PostsFeed extends Component {
    static propTypes = {
        selectedStreet: PropTypes.shape({
            streetName: PropTypes.string,
            placeId: PropTypes.string,
            location: PropTypes.array,
            members: PropTypes.array,
        }),
        Strings: PropTypes.shape({
            search: PropTypes.string,
        }),
        isMember: PropTypes.bool,
        postsfeed: PropTypes.array,
        addPostSubmitted: PropTypes.func.isRequired,
        addCommentSubmitted: PropTypes.func.isRequired,
        getPostsByPlaceId: PropTypes.func.isRequired,
        username: PropTypes.string,
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    componentDidMount = () => {
        this.interval = setInterval(this.getPostsFeed, 10000);
    }

    getPostsFeed = () => {
        const { getPostsByPlaceId, selectedStreet: { placeId } } = this.props;
        getPostsByPlaceId(placeId);
    }

    getPostsFeedList = () => {
        const { addCommentSubmitted, postsfeed } = this.props;

        return postsfeed && postsfeed.length > 0 ?
            postsfeed.map((post, i) =>
                <Post
                    key={i}
                    addCommentHandler={addCommentSubmitted}
                    postContent={post}
                />) : null;
    }

    addNewPost = (newPost) => {
        const { addPostSubmitted, selectedStreet: { _id } } = this.props;
        addPostSubmitted(newPost, _id);
    }

    render() {
        const { isMember, username, Strings } = this.props;

        return (
            <div>
                <div id='streetResult' className='container' />
                {
                    isMember !== true ?
                        null : <PostForm Strings={Strings} username={username} addNewPost={this.addNewPost} />
                }
                <div>
                    {this.getPostsFeedList()}
                </div>
            </div>
        );
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({ addPostSubmitted, addCommentSubmitted, getPostsByPlaceId }, dispatch);
}

export default connect(select, matchDispatchToProps)(PostsFeed);
