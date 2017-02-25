import * as userApi from 'api/user-api';
import * as streetsApi from 'api/streets-api';
import { push } from 'react-router-redux';
import userActionTypes from './user-action-types';
import myStreetsActionTypes from './my-streets-action-types';

export function facebookLoginSubmitted(user) {
    return dispatch => {
        dispatch({
            type: userActionTypes.FACEBOOK_LOGIN_SUBMITTED,
            data: { user },
        });

        userApi.getFacebookLogin(user)
            .then(
                response => dispatch(loginSucceded(response)),
                error => dispatch(loginFailed(error)),
            );
    };
}

function loginSucceded({ user }) {
    return dispatch => {
        dispatch({
            type: userActionTypes.LOGIN_SUCCEEDED,
            data: { ...user },
        });

        if (user.local.primaryStreet) {
            streetsApi.getStreetByPlaceId(user.local.primaryStreet.place_id)
                .then(
                    response => dispatch(searchStreetSucceeded(response, user.local.primaryStreet)),
                    error => dispatch(searchStreetFailed(error)),
            );
        }

        dispatch(push('/mystreets'));
    };
}

function searchStreetSucceeded(response, primaryStreet) {
    return {
        type: myStreetsActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet: response || primaryStreet },
    };
}

function searchStreetFailed(error) {
    return {
        type: myStreetsActionTypes.SEARCH_FAILED,
    };
}

function loginFailed() {
    return {
        type: userActionTypes.LOGIN_FAILED,
    };
}
