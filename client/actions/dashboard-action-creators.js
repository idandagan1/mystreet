import * as streetsApi from 'api/streets-api';
import dashboardActionTypes from './dashboard-action-types';

export function dashboardSearchSubmitted(streetObject) {
    return dispatch => {
        dispatch({
            type: dashboardActionTypes.SEARCH_SUBMITTED,
            data: { streetObject },
        });

        streetsApi.getStreet(streetObject.placeId)
            .then(
                response => dispatch(dashboardSearchSucceeded(streetObject, response)),
                error => dispatch(dashboardSearchFailed(streetObject, error)),
            );
    };
}

export function dashboardSearchSucceeded(selectedStreet, response) {
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
