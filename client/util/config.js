const apiUrl = `${process.env.SERVER_URL}:${process.env.PORT}`;

export default {
    user: `${apiUrl}/user`,
    mystreets: `${apiUrl}/mystreets`,
    posts: `${apiUrl}/posts`,
};
