import createReducer from 'util/create-reducer';
import postActionTypes from 'actions/post-action-types';

const initialState = {
    newComment: {
        author: '',
        body: '',
        createdDate: '',
    },
    postsfeed: [],
};

export default createReducer(initialState, {
    [postActionTypes.ADD_COMMENT_SUCCEEDED](state, action) {
        const { data: { newComment } } = action;
        return {
            ...state,
            newComment,
        };
    },
});
