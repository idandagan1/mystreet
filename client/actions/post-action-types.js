import createActionTypes from 'util/create-action-types';

export default createActionTypes('POST', [
    'ADD_POST_SUBMITTED',
    'ADD_POST_SUCCEEDED',
    'ADD_POST_FAILED',
    'GET_POSTSFEED_SUCCEEDED',
    'POSTSFEED_NOT_FOUND',
    'ADD_COMMENT_SUCCEEDED',
    'ADD_COMMENT_FAILED',
    'DELETE_POST_SUBMITTED',
    'DELETE_POST_SUCCEEDED',
    'DELETE_POST_FAILED',
]);
