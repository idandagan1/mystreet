import createReducer from 'util/create-reducer';
import postActionTypes from 'actions/post-action-types';
import headerActionTypes from 'views/header/state/header-action-types';

const initialState = {
    newPost: {
        author: '',
        body: '',
        createdDate: '',
    },
    postsfeed: [],
};

export default createReducer(initialState, {
    [postActionTypes.ADD_POST_SUCCEEDED](state, action) {
        const { data: { post: { newPost } } } = action;
        return {
            ...state,
            newPost,
        };
    },
    [headerActionTypes.GET_POSTS_SUCCEEDED](state, action) {
        const { data: { postsfeed } } = action;
        return {
            ...state,
            postsfeed,
        };
    },

});
