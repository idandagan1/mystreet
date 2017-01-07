import createReducer from 'util/create-reducer';

const initialState = {
    street: '',
    placeId: '',
    location: {
        lng: null,
        lat: null,
    },
};

export default createReducer(initialState, {

});
