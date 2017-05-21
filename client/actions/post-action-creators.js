import * as postApi from 'api/post-api';
import postActionTypes from './post-action-types';

export function addPostSubmitted(post, streetId) {
    return dispatch => {
        dispatch({
            type: postActionTypes.ADD_POST_SUBMITTED,
            data: post,
        });

        postApi.addPost(post, streetId)
            .then(
                response => dispatch(addPostSucceeded(response)),
                error => dispatch(addPostFailed(error)),
            );
    };
}

export function addCommentSubmitted(comment, postId) {
    return dispatch => {
        postApi.addComment(comment, postId)
            .then(
                response => dispatch(addCommentSucceeded(response)),
                error => dispatch(addCommentFailed(error)),
            );
    };
}

function addPostSucceeded(post) {
    return {
        type: postActionTypes.ADD_POST_SUCCEEDED,
        data: { post },
    };
}

function addPostFailed(error) {
    return {
        type: postActionTypes.ADD_POST_FAILED,
    };
}

function addCommentSucceeded({ newComment }) {
    return {
        type: postActionTypes.ADD_COMMENT_SUCCEEDED,
        data: { newComment },
    };
}

function addCommentFailed(error) {
    return {
        type: postActionTypes.ADD_COMMENT_FAILED,
    };
}
