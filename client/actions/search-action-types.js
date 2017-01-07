import createActionTypes from 'util/create-action-types';

export default createActionTypes('SEARCH', [
    'SUBMITTED',
    'SUCCEEDED',
    'FAILED',
]);
