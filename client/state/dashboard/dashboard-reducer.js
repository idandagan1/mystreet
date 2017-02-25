import createReducer from 'util/create-reducer';
import dashboardActionTypes from 'actions/dashboard-action-types';

const initialState = {
    selectedStreet: {
        streetName: 'Search for your street',
        place_id: '',
        location: [34.7818, 32.0853],
    },
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
});
