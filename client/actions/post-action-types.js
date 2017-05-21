import createActionTypes from 'util/create-action-types';

export default createActionTypes('POST', [
    'ADD_POST_SUBMITTED',
    'ADD_POST_SUCCEEDED',
    'ADD_POST_FAILED',
    'POSTSFEED_NOT_FOUND',
    'ADD_COMMENT_SUCCEEDED',
    'ADD_COMMENT_FAILED',
]);
