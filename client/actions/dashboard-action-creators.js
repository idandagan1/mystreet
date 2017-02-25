import * as streetsApi from 'api/streets-api';
import dashboardActionTypes from './dashboard-action-types';

export function dashboardSearchSubmitted(selectedStreet) {
    return dispatch => {
        dispatch({
            type: dashboardActionTypes.SEARCH_SUBMITTED,
            data: { selectedStreet },
        });

        streetsApi.getStreetByPlaceId(selectedStreet.place_id)
            .then(
                response => dispatch(dashboardSearchSucceeded(response, selectedStreet)),
                error => dispatch(dashboardSearchFailed(error)),
            );
    };
}

export function dashboardSearchSucceeded(response, street) {

    const selectedStreet = response || street;
    return {
        type: dashboardActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet },
    };
}

export function dashboardSearchFailed(error) {

    return {
        type: dashboardActionTypes.SEARCH_FAILED,
    };
}
