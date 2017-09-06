import createReducer from 'util/create-reducer';
import businessActionTypes from 'actions/business-action-types';

const initialState = {
    users: [],
};

export default createReducer(initialState, {
    [businessActionTypes.GET_USERS_SUCCEEDED](state, action) {
        const { data: { users } } = action;
        return {
            ...state,
            users,
        };
    },
});
