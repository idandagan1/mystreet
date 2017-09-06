import Cookies from 'universal-cookie';
import businessActionTypes from './business-action-types';
import * as businessApi from '../api/business-api';

const cookies = new Cookies();

export function getUsersByRadius(radiues, coords) {
    return (dispatch) => {

        businessApi.getUsersByRadius(radiues, coords)
            .then(
                response => dispatch(getUsersSucceeded(response)),
                error => dispatch(getUsersFailed(error)),
            );
    };
}

function getUsersSucceeded(users) {
    return {
        type: businessActionTypes.GET_USERS_SUCCEEDED,
        data: { users },
    };
}

function getUsersFailed(err) {
    return {
        type: businessActionTypes.GET_USERS_FAILED,
        data: { err },
    };
}
