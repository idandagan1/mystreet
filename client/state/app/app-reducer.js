import createReducer from 'util/create-reducer';
import appActionTypes from 'actions/app-action-types';
import userActionTypes from 'actions/user-action-types';

const initialState = {
    isAuthenticated: false,
};

export default createReducer(initialState, {
    [userActionTypes.LOGIN_SUCCEEDED](state, action) {
        return {
            ...state,
            isAuthenticated: true,
        };
    },
});
