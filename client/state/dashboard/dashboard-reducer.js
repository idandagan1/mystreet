import createReducer from 'util/create-reducer';
import dashboardActionTypes from 'actions/dashboard-action-types';

const initialState = {
    street: '',
    placeId: '',
    location: {
        lng: null,
        lat: null,
    },
};

export default createReducer(initialState, {
    [dashboardActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { streetObject } } = action;

        return {
            ...state,
            ...streetObject,
        };
    },

    [dashboardActionTypes.SEARCH_FAILED]() {
        return {
            ...initialState,
        };
    },
});
