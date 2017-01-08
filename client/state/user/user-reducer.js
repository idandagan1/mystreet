import createReducer from 'util/create-reducer';
import userActionTypes from 'actions/user-action-types';

const initialState = {
    name: '',
    facebook: {
        id: '',
        name: '',
        token: '',
    },

    local: {
        isPremium: false,
        lastLogged: '',
        primaryStreet: null,
        streets: [],
    },
};

export default createReducer(initialState, {
    [userActionTypes.LOGIN_SUCCEEDED](state, action) {
        const { data: { local, name } } = action;

        return {
            ...state,
            name,
            local,
        };
    },

    [userActionTypes.FACEBOOK_LOGIN_SUCCEEDED](state, action) {
        const { data: { accessToken: token, id, name } } = action;
        const facebook = { id, name, token };

        return {
            ...state,
            facebook,
        };
    },
});
