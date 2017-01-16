import { facebookLoginSubmitted } from 'actions/user-action-creators';
import * as streetsApi from 'api/streets-api';
import headerActionTypes from './header-action-types';

export function loginSubmitted(user) {
    return dispatch => {
        dispatch({
            type: headerActionTypes.LOGIN_SUBMITTED,
        });

        dispatch(facebookLoginSubmitted(user));
    };
}

export function searchSubmitted(query) {
    return dispatch => {
        dispatch({
            type: headerActionTypes.SEARCH_SUBMITTED,
            data: { query },
        });

        if (query.place_id) {
            streetsApi.getStreet(query.place_id)
                .then(
                    response => dispatch(streetSearchSucceeded(response)),
                    error => dispatch(streetSearchFailed(error)),
                );
        }

        if (query.userId) {
            // TODO
        }
    };
}

export function streetSearchSucceeded(streetObject) {
    return {
        type: headerActionTypes.SEARCH_SUCCEEDED,
        data: { streetObject },
    };
}

export function streetSearchFailed(error) {
    return {
        type: headerActionTypes.SEARCH_FAILED,
        data: { error },
    };
}
