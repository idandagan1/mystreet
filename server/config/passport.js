/* eslint-disable consistent-return, no-param-reassign */
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/user';
import configAuth from './auth';

export default function (app) {

    const { facebookAuth: { clientID, clientSecret, callbackURL } } = configAuth;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.authenticate('facebook', { scope: ['email', 'user_friends', 'public_profile'] });

    passport.use(new FacebookStrategy({
        clientID,
        clientSecret,
        callbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
            const { id, name, first_name, last_name, gender, accessToken: token } = profile;

            User.findOne({ 'facebook.id': id }).populate([{ path: 'local.primaryStreet', model: 'street' }, { path: 'local.streets', model: 'street' }]).then((user, err) => {

                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }

                const newUser = new User({
                    facebook: {
                        id,
                        token,
                        name,
                        first_name,
                        last_name,
                        gender,
                    },
                    name,
                });

                newUser.save(error => {
                    if (error) throw error;
                    return done(null, newUser);
                });
            });
        });
    }));

}
