import * as postApi from 'api/post-api';
import postActionTypes from './post-action-types';

export function addPostSubmitted(post, streetId) {
    return dispatch => {
        dispatch({
            type: postActionTypes.ADD_POST_SUBMITTED,
        });

        postApi.addPost(post, streetId)
            .then(
                response => dispatch(addPostSucceeded(response)),
                error => dispatch(addPostFailed(error)),
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
