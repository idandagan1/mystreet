import createReducer from 'util/create-reducer';
import myStreetsActionTypes from 'actions/my-streets-action-types';
import headerActionTypes from 'views/header/state/header-action-types';
import dashboardActionTypes from 'actions/dashboard-action-types';

const initialState = {
    selectedStreet: {
        streetName: '',
        place_id: '',
        location: {
            lng: 34.7818,
            lat: 32.0853,
        },
    },
    streetResult: {
        _id: '',
    },
};

export default createReducer(initialState, {
    [myStreetsActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { streetObject } } = action;

        return {
            ...state,
            selectedStreet: streetObject,
        };
    },

    [myStreetsActionTypes.FAILED]() {
        return {
            ...initialState,
        };
    },

    [headerActionTypes.SEARCH_SUBMITTED](state, action) {
        const { data: { query } } = action;
        return {
            ...state,
            selectedStreet: query,
        };
    },

    [headerActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { response } } = action;
        return {
            ...state,
            streetResult: response,
        };
    },

    [dashboardActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { response } } = action;
        return {
            ...state,
            selectedStreet: response,
        };
    },

    [dashboardActionTypes.SEARCH_SUBMITTED](state, action) {
        const { data: { selectedStreet } } = action;
        return {
            ...state,
            selectedStreet,
        };
    },
});
