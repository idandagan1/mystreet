import { facebookLoginSubmitted } from 'actions/user-action-creators';
import appLayoutActionTypes from './app-layout-action-types';

export default function loginSubmitted(user) {
    return dispatch => {
        dispatch({
            type: appLayoutActionTypes.LOGIN_SUBMITTED,
        });

        dispatch(facebookLoginSubmitted(user));
    };
}
