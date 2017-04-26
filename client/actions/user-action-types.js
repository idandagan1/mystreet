import createActionTypes from 'util/create-action-types';

export default createActionTypes('USER', [
    'FACEBOOK_LOGIN_SUBMITTED',
    'LOGIN_SUCCEEDED',
    'LOGIN_FAILED',
    'SEARCH_SUCCEEDED',
    'SEARCH_FAILED',
]);
