import * as mystreetsApi from 'api/mystreets-api';
import searchActionTypes from './search-action-types';

export function searchStreetSubmitted(streetObject) {
    return dispatch => {
        dispatch({
            type: searchActionTypes.SUBMITTED,
            data: { streetObject },
        });

        mystreetsApi.getStreet(streetObject.placeId)
            .then(
                response => dispatch(searchStreetSucceeded(response)),
                error => dispatch(searchStreetFailed(error)),
            );
    };
}

export function searchStreetSucceeded(response) {
    return {
        type: searchActionTypes.SUCCEEDED,
        data: { response },
    };
}

export function searchStreetFailed(error) {
    return {
        type: searchActionTypes.FAILED,
    };
}
