import { facebookLoginSubmitted } from 'actions/user-action-creators';
import headerActionTypes from './header-action-types';

export function loginSubmitted(user) {
    return dispatch => {
        dispatch({
            type: headerActionTypes.LOGIN_SUBMITTED,
        });

        dispatch(facebookLoginSubmitted(user));
    };
}
