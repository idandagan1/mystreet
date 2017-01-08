import headerActionTypes from './header-action-types';

export function loginSubmitted() {
    return dispatch => {
        dispatch({
            type: headerActionTypes.LOGIN_SUBMITTED,
        });
    };
}
