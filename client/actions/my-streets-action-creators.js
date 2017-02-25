import * as streetsApi from 'api/streets-api';
import myStreetsActionTypes from './my-streets-action-types';

export function searchStreetSubmitted(streetObject) {
    return dispatch => {
        dispatch({
            type: myStreetsActionTypes.SEARCH_SUBMITTED,
            data: { streetObject },
        });

        streetsApi.getStreet(streetObject.place_id)
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
                response => dispatch(addStreetSucceeded(response, street)),
                error => dispatch(addStreetFailed(error)),
            );
    };
}

function searchStreetSucceeded(response, street) {
    return {
        type: myStreetsActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet: response || street },
    };
}

function searchStreetFailed(error) {
    return {
        type: myStreetsActionTypes.SEARCH_FAILED,
    };
}

export function getMembersSucceeded(members) {
    return {
        type: myStreetsActionTypes.GET_MEMBERS_SUCCEEDED,
        data: { members },
    };
}

export function addStreetSucceeded(response, street) {
    const { content: { selectedStreet, activeUser } } = response;

    return dispatch => {
        dispatch({
            type: myStreetsActionTypes.ADD_STREET_SUCCEEDED,
            data: { selectedStreet, activeUser },
        });

        dispatch(getStreet(street));
    };
}

export function addStreetFailed(error) {
    return {
        type: myStreetsActionTypes.ADD_STREET_FAILED,
        data: { error },
    };
}

export function getStreet(street) {
    return (dispatch) => {
        streetsApi.getStreetByPlaceId(street.place_id)
            .then(
                response => dispatch(searchStreetSucceeded(response, street)),
                error => dispatch(searchStreetFailed(error)),
            );
    };
}

