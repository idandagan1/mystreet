import createActionTypes from 'util/create-action-types';

export default createActionTypes('DASHBOARD', [
    'SEARCH_SUBMITTED',
    'SEARCH_SUCCEEDED',
    'SEARCH_FAILED',

    'GET_POSTS_SUCCEEDED',
    'GET_POSTS_FAILED',
    'GET_STREETS_NEARBY_SUCCEEDED',
]);
