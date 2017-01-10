import * as streetsApi from 'api/streets-api';
import dashboardActionTypes from './dashboard-action-types';

export function dashboardSearchSubmitted(streetObject) {
    return dispatch => {
        dispatch({
            type: dashboardActionTypes.SUBMITTED,
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
        type: dashboardActionTypes.SUCCEEDED,
        data: { streetObject },
    };
}

export function dashboardSearchFailed(error) {
    return {
        type: dashboardActionTypes.FAILED,
        data: { error },
    };
}
