import createActionTypes from 'util/create-action-types';

export default createActionTypes('USER', [
    'FACEBOOK_LOGIN_SUBMITTED',
    'LOGIN_SUCCEEDED',
    'LOGOUT_SUCCEEDED',
    'LOGOUT_FAILED',
    'LOGIN_FAILED',
    'SEARCH_SUCCEEDED',
    'SEARCH_FAILED',
    'USER_NOT_FOUND',
    'USER_SELECTED',
    'GET_USER_SUCCEEDED',
    'GET_USER_FAILED',
    'UPDATE_USER_FAILED',
    'UPDATE_USER_SUCCEEDED',
]);
