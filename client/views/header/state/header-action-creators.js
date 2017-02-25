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
            streetsApi.getStreetByPlaceId(query.place_id)
                .then(
                    response => dispatch(streetSearchSucceeded(response, query)),
                    error => dispatch(streetSearchFailed(error)),
                );
        }

        if (query.userId) {
            // TODO
        }
    };
}

export function getMembersSucceeded(members) {
    return {
        type: headerActionTypes.GET_MEMBERS_SUCCEEDED,
        data: { members },
    };
}

export function streetSearchSucceeded(streetObject, query) {
    const selectedStreet = streetObject || query;
    return {
        type: headerActionTypes.SEARCH_SUCCEEDED,
        data: { selectedStreet },
    };
}

export function streetSearchFailed(error) {
    return {
        type: headerActionTypes.SEARCH_FAILED,
        data: { error },
    };
}
