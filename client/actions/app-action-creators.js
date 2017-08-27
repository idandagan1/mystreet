import appActionTypes from './app-action-types';
import userActionTypes from './user-action-types';
import myStreetsActionTypes from './my-streets-action-types';
import * as streetApi from '../api/streets-api';
import * as userApi from '../api/user-api';
import * as appApi from '../api/app-api';
import * as utils from '../util/utils';

export function appLoaded() {
    return (dispatch, getState) => {
        window.state = getState;
        dispatch({
            type: appActionTypes.LOADED,
        });

        dispatch(changeLanguange(utils.getCookie('language') || navigator.language));

        appApi.getUserLocation()
            .then(
                response => dispatch(getLocationSucceeded(response)),
                error => dispatch(getLocationFailed(error)),
            );

        userApi.getActiveUser()
            .then(
                response => dispatch(getActiveUserSuccededed(response)),
                error => dispatch(getActiveUserFailed(error)),
            );
    };
}

export function setLanguage(lang) {
    return (dispatch) => {
        dispatch(changeLanguange(lang));
    };
}

function getLocationSucceeded(res) {
    return {
        type: appActionTypes.GET_USER_LOCATION_SUCCEEDED,
        data: res,
    };
}

function getLocationFailed(err){
    throw err;
}

function changeLanguange(lang) {
    return {
        type: appActionTypes.SET_LANGUAGE,
        data: { ...getStrings(lang) },
    };
}

function getStrings(lang) {

    if (!lang) {
        return require('../resources/languages/en');
    }

    if (lang.includes('en')) {
        document.body.classList.remove('x-rtl');
        return require('../resources/languages/en');
    }

    if (lang.includes('he')) {
        document.body.classList.add('x-rtl');
        return require('../resources/languages/he');
    }

    return null;
}

function getActiveUserSuccededed({ activeUser }) {

    return dispatch => {

        if (!activeUser) {
            return dispatch({ type: userActionTypes.USER_NOT_FOUND });
        }

        dispatch({
            type: userActionTypes.LOGIN_SUCCEEDED,
            data: { ...activeUser },
        });

        if (activeUser.local.primaryStreet) {
            streetApi.getStreetByPlaceId(activeUser.local.primaryStreet.placeId)
                .then(
                    response => dispatch(getStreetSuccededed(response)),
                    error => dispatch(getStreetFailed(error)),
                );
        }

    };
}

function getActiveUserFailed(response) {
    return {
        type: userActionTypes.USER_NOT_FOUND,
    };
}

function getStreetSuccededed({ selectedStreet }) {
    return selectedStreet ? {
        type: myStreetsActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet },
    } : { type: myStreetsActionTypes.STREET_NOT_FOUND };
}

function getStreetFailed(response) {
    return {
        type: myStreetsActionTypes.STREET_NOT_FOUND,
    };
}
