import createReducer from 'util/create-reducer';
import userActionTypes from 'actions/user-action-types';
import myStreetsActionTypes from 'actions/my-streets-action-types';
import appActionTypes from 'actions/app-action-types';

const initialState = {
    activeUser: {
        _id: '',
        name: '',
        facebook: {
            id: '',
            name: '',
            token: '',
            first_name: '',
            last_name: '',
            gender: '',
            friends: [],
        },
        local: {
            isPremium: false,
            lastLogged: '',
            primaryStreet: {
                location: [34.7818, 32.0853],
                placeId: '',
                address: '',
            },
            streets: [],
        },
    },
    Strings: {},
    country: '',
};

export default createReducer(initialState, {
    [userActionTypes.LOGIN_SUCCEEDED](state, action) {
        const { data: { local, facebook, name, _id } } = action;

        return {
            ...state,
            activeUser: {
                name,
                local,
                facebook,
                _id,
            },
        };
    },

    [appActionTypes.SET_LANGUAGE](state, action) {
        const { data: Strings } = action;

        return {
            ...state,
            Strings,
        };
    },

    [appActionTypes.GET_USER_LOCATION_SUCCEEDED](state, action) {
        const { data: { country } } = action;

        return {
            ...state,
            country,
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

    [userActionTypes.UPDATE_USER_SUCCEEDED](state, action) {
        const { data: { activeUser } } = action;

        return {
            ...state,
            activeUser,
        };
    },

    [userActionTypes.GET_USER_SUCCEEDED](state, action) {
        const { data: { selectedUser } } = action;

        return {
            ...state,
            selectedUser,
        };
    },

    [userActionTypes.LOGOUT_SUCCEEDED](state, action) {
        return {
            ...state,
            ...initialState,
        };
    },

    [myStreetsActionTypes.CHANGE_PRIMARY_STREET_SUCCEEDED](state, action) {
        const { data: { activeUser } } = action;

        return {
            ...state,
            activeUser,
        };
    },

    [myStreetsActionTypes.LEAVE_STREET_SUCCEEDED](state, action) {
        const { data: { activeUser } } = action;

        return {
            ...state,
            activeUser,
        };
    },

    [myStreetsActionTypes.ADD_STREET_SUCCEEDED](state, action) {
        const { data: { activeUser } } = action;

        return {
            ...state,
            activeUser,
        };
    },

});
