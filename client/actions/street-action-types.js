import * as streetsApi from 'api/streets-api';
import streetActionTypes from './street-action-types';

export function addStreetSubmitted(street) {
    return dispatch => {
        dispatch({
            type: streetActionTypes.ADD_STREET_SUBMITTED,
            data: { street },
        });
    };
}
