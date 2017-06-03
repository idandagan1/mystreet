import React, { Component, PropTypes } from 'react';
import { addPostSubmitted, addCommentSubmitted, getPostsByPlaceId } from 'actions/post-action-creators';
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
        const { getPostsByPlaceId, selectedStreet: { place_id } } = this.props;
        getPostsByPlaceId(place_id);
    }

    getPostsFeedList = () => {
        const { addCommentSubmitted, postsfeed } = this.props;

        return postsfeed && postsfeed.length > 0 ?
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
