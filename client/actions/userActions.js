import * as userApi from 'api/user-api';
import userActionTypes from './user-action-types';

export function facebookLoginSucceeded(user) {
    return dispatch => {
        dispatch({
            type: userActionTypes.FACEBOOK_LOGIN_SUCCEEDED,
        });

        userApi.getFacebookLogin(user)
            .then(
                response => dispatch(mystreetLoginSucceeded()),
                error => dispatch(mystreetLoginFailed()),
            );
    };
}

function mystreetLoginSucceeded() {
    return {
        type: userActionTypes.LOGIN_SUCCEEDED,
    };
}

function mystreetLoginFailed() {
    return {
        type: userActionTypes.LOGIN_FAILED,
    };
}
