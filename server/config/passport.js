/* eslint-disable consistent-return, no-param-reassign */
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/user';
import * as configs from './auth';

export default function (app) {
    const configAuth = process.env.NODE_ENV === 'production' ? configs.facebookProdAuth : configs.facebookDevAuth;
    const { clientID, clientSecret, callbackURL } = configAuth;
    const profileFields = ['id,friends,about,age_range,cover,picture,birthday,context,email,first_name,last_name,gender,hometown,link,location,middle_name,name,timezone,website,work'];

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

    passport.use(new FacebookStrategy({
        clientID,
        clientSecret,
        callbackURL,
        profileFields,
    },
    (accessToken, refreshToken, profile, done) => {
        // asynchronous
        process.nextTick(() => {
            const {
                _json: {
                    id, email, link, name, first_name, last_name, gender,
                    picture: { data: { url: imgurl } },
                },
                accessToken: token,
            } = profile;

            User.findOne({ 'facebook.id': id })
                .populate([{ path: 'local.primaryStreet', model: 'street' }, { path: 'local.streets', model: 'street' }])
                .then((user, err) => {

                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    }

                    const newUser = new User({
                        facebook: {
                            id,
                            email,
                            link,
                            imgurl,
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
