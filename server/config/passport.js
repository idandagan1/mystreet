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
        process.nextTick(() => {
            const { id, displayName } = profile;
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id': id }, (err, user) => {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) return done(err);
                // if the user is found, then log them in
                if (!user) {
                    const newUser = new User({
                        facebook: {
                            id,
                            token,
                            name: displayName,
                        },
                        name: displayName,
                    });

                    newUser.save(error => {
                        if (error) throw error;
                        return done(error, newUser);
                    });
                } else {
                    user.local.lastLogged = Date.now();
                    user.save();
                    return done(err, user); // user found, return that user
                }

            });
        });
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
