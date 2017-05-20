import * as streetsApi from 'api/streets-api';
import myStreetsActionTypes from './my-streets-action-types';

export function searchStreetSubmitted(streetObject) {
    return dispatch => {
        dispatch({
            type: myStreetsActionTypes.SEARCH_SUBMITTED,
            data: { streetObject },
        });
        streetsApi.getStreetByPlaceId(streetObject.place_id)
            .then(
                response => dispatch(searchStreetSucceeded(response, streetObject)),
                error => dispatch(searchStreetFailed(error)),
            );
        streetsApi.getNearbyStreets(streetObject)
            .then(
                response => dispatch(getNearbyStreetsSucceeded(response, streetObject)),
                error => dispatch(searchStreetFailed(error)),
            );
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

export function changePrimaryStreet(street) {
    return (dispatch) => {
        streetsApi.changePrimaryStreet(street._id)
            .then(
                response => dispatch(changePrimaryStreetSucceeded(response)),
                error => dispatch(addStreetFailed(error)),
            );
    };
}

function changePrimaryStreetSucceeded({ activeUser }) {
    return {
        type: myStreetsActionTypes.CHANGE_PRIMARY_STREET_SUCCEEDED,
        data: { activeUser },
    };
}

function getStreetSucceeded({ selectedStreet }) {
    return {
        type: myStreetsActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet },
    };
}

function searchStreetSucceeded({ selectedStreet }, street) {
    return {
        type: myStreetsActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet: selectedStreet || street },
    };
}

function searchStreetFailed(error) {
    return {
        type: myStreetsActionTypes.SEARCH_FAILED,
    };
}

function getMembersSucceeded(members) {
    return {
        type: myStreetsActionTypes.GET_MEMBERS_SUCCEEDED,
        data: { members },
    };
}

function addStreetSucceeded(response, street) {
    const { content: { selectedStreet, activeUser } } = response;

    return dispatch => {
        dispatch({
            type: myStreetsActionTypes.ADD_STREET_SUCCEEDED,
            data: { selectedStreet, activeUser },
        });
    };
}

function addStreetFailed(error) {
    return {
        type: myStreetsActionTypes.ADD_STREET_FAILED,
        data: { error },
    };
}

function getPostsSucceeded(streetObject) {
    const { postsfeed } = streetObject;
    return {
        type: myStreetsActionTypes.GET_POSTS_SUCCEEDED,
        data: { postsfeed },
    };
}

function getPostsFailed(error) {
    return {
        type: myStreetsActionTypes.GET_POSTS_FAILED,
        data: { error },
    };
}

function getNearbyStreetsSucceeded(streets, selectedStreet) {
    return {
        type: myStreetsActionTypes.GET_STREETS_NEARBY_SUCCEEDED,
        data: {
            ...streets,
            selectedStreet,
        },
    };
}

