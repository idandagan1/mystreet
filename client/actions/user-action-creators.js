import * as userApi from 'api/user-api';
import { push } from 'react-router-redux';
import userActionTypes from './user-action-types';

export function facebookLoginSubmitted(user) {
    return dispatch => {
        dispatch({
            type: userActionTypes.FACEBOOK_LOGIN_SUBMITTED,
            data: { user },
        });

        userApi.getFacebookLogin(user)
            .then(
                response => dispatch(loginSucceded(response)),
                error => dispatch(loginFailed()),
            );
    };
}

function loginSucceded(user) {
    return dispatch => {
        dispatch({
            type: userActionTypes.LOGIN_SUCCEEDED,
            data: { ...user },
        });

        dispatch(push('/mystreets'));
    };
}

function loginFailed() {
    return {
        type: userActionTypes.LOGIN_FAILED,
    };
}
