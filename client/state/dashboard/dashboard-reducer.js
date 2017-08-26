import createReducer from 'util/create-reducer';
import dashboardActionTypes from 'actions/dashboard-action-types';
import appActionTypes from 'actions/app-action-types';

const initialState = {
    selectedStreet: {
        streetName: 'Search for your street',
        placeId: 'a',
        location: [34.7818, 32.0853],
    },
    Strings: {},
};

export default createReducer(initialState, {
    [dashboardActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;
        return {
            ...state,
            selectedStreet,
        };
    },

    [dashboardActionTypes.SEARCH_FAILED]() {
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
});
