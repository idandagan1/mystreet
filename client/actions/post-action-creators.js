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

export function getPostsByPlaceId(placeId) {
    return dispatch => {
        postApi.getPostsByPlaceId(placeId)
            .then(
                response => dispatch(getPostsSucceeded(response)),
                error => dispatch(getPostsFailed(error)),
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

function getPostsSucceeded({ postsfeed }) {
    return {
        type: postActionTypes.GET_POSTSFEED_SUCCEEDED,
        data: { postsfeed },
    };
}

function getPostsFailed(error) {
    return {
        type: postActionTypes.POSTSFEED_NOT_FOUND,
        data: { error },
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
