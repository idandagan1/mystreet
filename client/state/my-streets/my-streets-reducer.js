import createReducer from 'util/create-reducer';
import myStreetsActionTypes from 'actions/my-streets-action-types';

const initialState = {
    activeStreet: {
        street: '',
        placeId: '',
        location: {
            lng: 34.7818,
            lat: 32.0853,
        },
    },
};

export default createReducer(initialState, {
    [myStreetsActionTypes.SEARCH_SUCCEEDED](state, action) {
        const { data: { streetObject } } = action;

        return {
            ...state,
            activeStreet: streetObject,
        };
    },

    [myStreetsActionTypes.FAILED]() {
        return {
            ...initialState,
        };
    },
});
