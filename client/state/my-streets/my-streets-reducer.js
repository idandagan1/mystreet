import createReducer from 'util/create-reducer';
import myStreetsActionTypes from 'actions/my-streets-action-types';
import headerActionTypes from 'views/header/state/header-action-types';
import dashboardActionTypes from 'actions/dashboard-action-types';
import appActionTypes from 'actions/app-action-types';

const initialState = {
    selectedStreet: {
        streetName: 'Search for your street',
        placeId: '',
        members: [],
        address: '',
        location: [34.7818, 32.0853],
    },
    members: [],
    Strings: {},
};

export default createReducer(initialState, {
    [myStreetsActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;

        return {
            ...state,
            selectedStreet: selectedStreet.placeId ? selectedStreet : initialState.selectedStreet,
        };
    },

    [myStreetsActionTypes.FAILED]() {
        return {
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

    [myStreetsActionTypes.ADD_STREET_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;

        return {
            ...state,
            selectedStreet: selectedStreet.placeId ? selectedStreet : initialState.selectedStreet,
        };
    },

    [headerActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;

        return {
            ...state,
            selectedStreet: selectedStreet.placeId ? selectedStreet : initialState.selectedStreet,
        };
    },

    [dashboardActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;
        return {
            ...state,
            selectedStreet,
        };
    },

    [headerActionTypes.GET_STREETS_NEARBY_SUCCEEDED](state, action) {
        const { data: { streetsNearby } } = action;
        return {
            ...state,
            streetsNearby,
        };
    },

    [myStreetsActionTypes.GET_STREETS_NEARBY_SUCCEEDED](state, action) {
        const { data: { streetsNearby } } = action;
        return {
            ...state,
            streetsNearby,
        };
    },
});
