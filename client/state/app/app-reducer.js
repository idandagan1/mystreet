import createReducer from 'util/create-reducer';
import userActionTypes from 'actions/user-action-types';
import mapActionTypes from 'actions/map-action-types';
import appActionTypes from 'actions/app-action-types';

const initialState = {
    isAuthenticated: false,
    mapSettings: {
        placeId: '',
        location: {
            lat: 0,
            lng: 0,
        },
        isMapInitialized: false,
    },
    Strings: {},
};

export default createReducer(initialState, {
    [userActionTypes.LOGIN_SUCCEEDED](state, action) {
        return {
            ...state,
            isAuthenticated: true,
        };
    },

    [mapActionTypes.INITIALIZED_MAP](state, action) {
        const { data: { mapSettings } } = action;
        return {
            ...state,
            mapSettings,
        };
    },

    [userActionTypes.LOGOUT_SUCCEEDED](state, action) {
        return {
            ...state,
            ...initialState,
        };
    },

    [appActionTypes.SET_LANGUAGE](state, action) {
        const { data: Strings } = action;

        return {
            ...state,
            Strings,
        };
    },
});
