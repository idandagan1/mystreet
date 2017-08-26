import createReducer from 'util/create-reducer';
import postActionTypes from 'actions/post-action-types';
import appActionTypes from 'actions/app-action-types';

const initialState = {
    newComment: {
        author: '',
        body: '',
        createdDate: '',
    },
    Strings: {},
};

export default createReducer(initialState, {
    [postActionTypes.ADD_COMMENT_SUCCEEDED](state, action) {
        const { data: { newComment } } = action;
        return {
            ...state,
            newComment,
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
