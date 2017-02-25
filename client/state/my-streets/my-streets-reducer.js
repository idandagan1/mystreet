import createReducer from 'util/create-reducer';
import myStreetsActionTypes from 'actions/my-streets-action-types';
import headerActionTypes from 'views/header/state/header-action-types';
import dashboardActionTypes from 'actions/dashboard-action-types';

const initialState = {
    selectedStreet: {
        streetName: 'Search for your street',
        place_id: '',
        members: [],
        location: [34.7818, 32.0853],
    },
    members: [],
};

export default createReducer(initialState, {
    [myStreetsActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;

        return {
            ...state,
            selectedStreet,
        };
    },

    [myStreetsActionTypes.FAILED]() {
        return {
            ...initialState,
        };
    },

    [myStreetsActionTypes.ADD_STREET_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;

        return {
            ...state,
            selectedStreet,
        };
    },

    [headerActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;

        return {
            ...state,
            selectedStreet,
            //members: selectedStreet.members,
        };
    },

    [dashboardActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { selectedStreet } } = action;
        return {
            ...state,
            selectedStreet,
        };
    },
});
