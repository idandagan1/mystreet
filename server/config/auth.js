export default {
    facebookAuth: {
        clientID: '678252172335402',
        clientSecret: 'f480a7e999813b1389aa775b97233994',
        callbackURL: `${process.env.SERVER_URL}:${process.env.PORT}/login/facebook/callback`,
    },
};
