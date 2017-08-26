import createActionTypes from 'util/create-action-types';

export default createActionTypes('APP', [
    'LOADED',
    'GET_ACTIVE_USER_SUCCEEDED',
    'GET_ACTIVE_USER_FAILED',
    'GET_STREET_SUCCEEDED',
    'GET_STREET_FAILED',
    'SET_LANGUAGE',
    'GET_USER_LOCATION_SUCCEEDED',
]);
