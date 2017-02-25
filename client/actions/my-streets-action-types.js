import createActionTypes from 'util/create-action-types';

export default createActionTypes('MY_STREETS', [
    'SEARCH_SUBMITTED',
    'SEARCH_SUCCEEDED',
    'SEARCH_FAILED',

    'ADD_STREET_SUBMITTED',
    'ADD_STREET_SUCCEEDED',
    'ADD_STREET_FAILED',

    'GET_MEMBERS_SUCCEEDED',
]);
