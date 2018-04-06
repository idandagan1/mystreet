import { Router as expressRouter } from 'express';
import passport from 'passport';
import {
    getFriends,
    getUsersByRadius,
    getUserById,
    getUserLogin,
    logoutUser,
    loginFacebook,
    updateUserInfo,
    updateProfessionalInfo
} from '../controllers/user';

const router = expressRouter();

// GET
router.get('/getFriends', getFriends);
router.get('/getUsersByRadius', getUsersByRadius);
router.get('/getUserById', getUserById);
router.get('/getUserLogin', getUserLogin);
router.get('/logoutUser', logoutUser);
router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'user_location', 'email', 'user_friends']
}));
router.get('/auth/facebook/callback', (req, res, next) => {
    passport.authenticate('facebook', (error, user) => {
        const uri = process.env.NODE_ENV === 'production' ?
            'https://mystreet.herokuapp.com'
            : 'http://localhost:8000';

        if (error || !user) {
            res.redirect(uri);
            return;
        }

        if (user) {
            req.session.user = user;
            req.session.save();
            res.redirect(`${uri}/mystreets`);
        }
    })(req, res, next);

});

// POST
router.post('/login/facebook', loginFacebook);
router.post('/updateUserInfo', updateUserInfo);
router.post('/updateProfessionalInfo', updateProfessionalInfo);

export default router;
