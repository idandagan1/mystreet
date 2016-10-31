var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/login',

    passport.authenticate('facebook', {
        scope: ['email,user_friends,public_profile']
    })
);

//router.get('/auth/facebook/callback',
router.get('/login/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/' }),
    function(req, res) {
        req.user.local.lastLogged = Date.now();
        req.session.user = req.user;
        req.session.streetID = null;
        req.session.postID = null;
        res.redirect('/street.html');
    });

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/');//TODO: change url
}


module.exports = router;
