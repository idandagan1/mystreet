import * as streetsApi from 'api/streets-api';
import dashboardActionTypes from './dashboard-action-types';

export function dashboardSearchSubmitted(selectedStreet) {
    return dispatch => {
        dispatch({
            type: dashboardActionTypes.SEARCH_SUBMITTED,
            data: { selectedStreet },
        });

        streetsApi.getStreet(selectedStreet.place_id)
            .then(
                response => dispatch(dashboardSearchSucceeded(selectedStreet, response)),
                error => dispatch(dashboardSearchFailed(selectedStreet, error)),
            );
    };
}

export function dashboardSearchSucceeded(selectedStreet, response) {

    if (response) {
        return {
            type: dashboardActionTypes.SEARCH_SUCCEEDED,
            data: { response },
        };
    }

    return {
        type: dashboardActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet },
    };
}

export function dashboardSearchFailed(selectedStreet, error) {
    return {
        type: dashboardActionTypes.SEARCH_FAILED,
        data: { selectedStreet },
    };
}
