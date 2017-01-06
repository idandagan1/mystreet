export const createPost = (post) => {
    return {
        type: 'NEW_POST',
        payload: post
    }
};