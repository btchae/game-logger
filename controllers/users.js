//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/game_logger";
var connection = new Sequelize(db);
var User = require('../models/users.js');
var passport = require('../config/passport.js');

// ------------------------------
// ROUTES THAT DON'T REQUIRE AUTH
// ------------------------------

// TESTING
router.get('/testing', function(req, res) {
 console.log('hi');
 res.send('bye');
});

// CREATE A NEW USER
router.post('/', function(req, res) {
  var data = {username: req.body.username, email: req.body.email, password: req.body.password}
  var newUser = User.create({username: data.username, email: data.email, password: data.password})
  // console.log(newUser);
  res.send(true);
});

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));

// TESTING
// router.get('/', function(req, res) {
//  console.log('hi');
//  res.send('bye');
// });
// router.get('/test', function(req, res) {
//  res.send('This should work only if logged in');
// });

// INDEX

module.exports = router;