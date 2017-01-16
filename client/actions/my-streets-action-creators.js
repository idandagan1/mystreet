import * as streetsApi from 'api/streets-api';
import myStreetsActionTypes from './my-streets-action-types';

export function searchStreetSubmitted(streetObject) {
    return dispatch => {
        dispatch({
            type: myStreetsActionTypes.SEARCH_SUBMITTED,
            data: { streetObject },
        });

        streetsApi.getStreet(streetObject.placeId)
            .then(
                response => dispatch(searchStreetSucceeded(response, streetObject)),
                error => dispatch(searchStreetFailed(error)),
            );
    };
}

function searchStreetSucceeded(userStreet, searchedStreet) {
    return {
        type: myStreetsActionTypes.SEARCH_SUCCEEDED,
        data: { streetObject: userStreet || searchedStreet },
    };
}

function searchStreetFailed(error) {
    return {
        type: myStreetsActionTypes.SEARCH_FAILED,
    };
}

export function addStreetSubmitted(street) {
    return (dispatch) => {

        dispatch({
            type: myStreetsActionTypes.ADD_STREET_SUBMITTED,
            data: { street },
        });

        streetsApi.addStreet(street)
            .then(
                response => addStreetSucceeded(response),
                error => addStreetFailed(error),
            );
    };
}

function addStreetSucceeded(streetObject) {
    return {
        type: myStreetsActionTypes.ADD_STREET_SUCCEEDED,
        data: { streetObject },
    };
}

function addStreetFailed(error) {
    return {
        type: myStreetsActionTypes.ADD_STREET_FAILED,
        data: { error },
    };
}

