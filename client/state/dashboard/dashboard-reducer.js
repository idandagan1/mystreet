import createReducer from 'util/create-reducer';
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
};

export default createReducer(initialState, {
    [dashboardActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { streetObject } } = action;

        return {
            ...state,
            selectedStreet: streetObject,
        };
    },

    [dashboardActionTypes.SEARCH_FAILED]() {
        return {
            ...initialState,
        };
    },
});
