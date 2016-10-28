var express = require('express');
var router = express.Router();

//var User = require('../models/user');


router.post('/register', function(req, res, next) {

    console.log("In register");
    res.send("Hello");

})

router.get('/', function(req, res, next) {

    console.log("In get");

})

module.exports = router;
