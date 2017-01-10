import createActionTypes from 'util/create-action-types';

export default createActionTypes('DASHBOARD', [
    'SEARCH_SUBMITTED',
    'SEARCH_SUCCEEDED',
    'SEARCH_FAILED',
]);
