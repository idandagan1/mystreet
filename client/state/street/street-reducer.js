import createReducer from 'util/create-reducer';
import searchActionTypes from 'actions/search-action-types';

const initialState = {
    street: '',
    placeId: '',
    location: {
        lng: null,
        lat: null,
    },
};

export default createReducer(initialState, {
    [searchActionTypes.SUCCEEDED](state, action) {
        const { data: { streetObject } } = action;

        return {
            ...state,
            ...streetObject,
        };
    },

    [searchActionTypes.FAILED]() {
        return {
            ...initialState,
        };
    },
});
