export const login = (user) => {
    return {
        type: 'USER_LOGIN',
        payload: user
    }
};
