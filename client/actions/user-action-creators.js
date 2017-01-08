import * as userApi from 'api/user-api';
import userActionTypes from './user-action-types';

export function facebookLoginSucceeded(user) {
    return dispatch => {
        dispatch({
            type: userActionTypes.FACEBOOK_LOGIN_SUCCEEDED,
            data: { user },
        });

        userApi.getFacebookLogin(user)
            .then(
                response => dispatch(mystreetLoginSucceeded(response)),
                error => dispatch(mystreetLoginFailed()),
            );
    };
}

function mystreetLoginSucceeded(user) {
    return {
        type: userActionTypes.LOGIN_SUCCEEDED,
        data: { ...user },
    };
}

function mystreetLoginFailed() {
    return {
        type: userActionTypes.LOGIN_FAILED,
    };
}
