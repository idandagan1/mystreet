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
                response => dispatch(dashboardSearchSucceeded(response)),
                error => dispatch(dashboardSearchFailed(error)),
            );
    };
}

export function dashboardSearchSucceeded(streetObject) {
    return {
        type: dashboardActionTypes.SEARCH_SUCCEEDED,
        data: { streetObject },
    };
}

export function dashboardSearchFailed(error) {
    return {
        type: dashboardActionTypes.SEARCH_FAILED,
        data: { error },
    };
}
