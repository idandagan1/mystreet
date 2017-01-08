/* eslint-disable consistent-return, no-param-reassign */
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/user';
import configAuth from './auth';

export default function (app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.authenticate('facebook', { scope: ['email', 'user_friends', 'public_profile'] });
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
    },
    (token, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {});
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
