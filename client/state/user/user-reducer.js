import createReducer from 'util/create-reducer';
import userActionTypes from 'actions/user-action-types';
import myStreetsActionTypes from 'actions/my-streets-action-types';

const initialState = {
    userId: '',
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
        const { data: { local, name, _id } } = action;

        return {
            ...state,
            name,
            local,
            userId: _id,
        };
    },

    [userActionTypes.FACEBOOK_LOGIN_SUBMITTED](state, action) {
        const { data: { user: { accessToken: token, id, name } } } = action;
        const facebook = { id, name, token };

        return {
            ...state,
            facebook,
        };
    },

    [myStreetsActionTypes.ADD_STREET_SUCCEEDED](state, action) {
        const { data: { activeUser: { local } } } = action;

        return {
            ...state,
            local,
        };
    },

});
