import * as streetsApi from 'api/streets-api';
import * as postsApi from 'api/post-api';
import dashboardActionTypes from './dashboard-action-types';

export function dashboardSearchSubmitted(selectedStreet) {
    return dispatch => {
        dispatch({
            type: dashboardActionTypes.SEARCH_SUBMITTED,
            data: { selectedStreet },
        });
        streetsApi.getStreetByPlaceId(selectedStreet.placeId)
            .then(
                response => dispatch(dashboardSearchSucceeded(response, selectedStreet)),
                error => dispatch(dashboardSearchFailed(error)),
            );
        postsApi.getPostsByPlaceId(selectedStreet.placeId)
            .then(
                response => dispatch(getPostsSucceeded(response)),
                error => dispatch(getPostsFailed(error)),
            );
        streetsApi.getNearbyStreets(selectedStreet)
            .then(
                response => dispatch(getNearbyStreetsSucceeded(response, selectedStreet)),
                error => dispatch(searchStreetFailed(error)),
            );
    };
}

function dashboardSearchFailed(error) {

    return {
        type: dashboardActionTypes.SEARCH_FAILED,
    };
}

function dashboardSearchSucceeded({ selectedStreet }, street) {
    return {
        type: dashboardActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet: selectedStreet || street },
    };
}

function getNearbyStreetsSucceeded(streets, selectedStreet) {
    return {
        type: dashboardActionTypes.GET_STREETS_NEARBY_SUCCEEDED,
        data: {
            ...streets,
            selectedStreet,
        },
    };
}

function searchStreetFailed(error) {
    return {
        type: dashboardActionTypes.SEARCH_FAILED,
        data: { error },
    };
}

function getPostsSucceeded(streetObject) {
    const { postsfeed } = streetObject;
    return {
        type: dashboardActionTypes.GET_POSTS_SUCCEEDED,
        data: { postsfeed },
    };
}

function getPostsFailed(error) {
    return {
        type: dashboardActionTypes.GET_POSTS_FAILED,
        data: { error },
    };
}
