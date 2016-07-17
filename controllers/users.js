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
// router.get('/testing', function(req, res) {
//  console.log('hi');
//  res.send('bye');
// });

// CREATE A NEW USER
router.post('/', function(req, res) {
  console.log('testing create user');
  var data = {username: req.body.username, email: req.body.email, password: req.body.password}
  var newUser = User.create({username: data.username, email: data.email, password: data.password})
  // console.log(newUser);
  res.send(true);
});

router.get('/', function(req, res) {
  console.log('testing index');
});

router.get('/seed', function(req, res) {
  console.log('testing seed');
  User.create({username: 'test', email: 'test', password: 'test'});
});

// USER SHOW - user profile
router.get("/:id", function(req, res) {
  User.findById(req.params.id).then(function(user, err) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

//UPDATE USER

//DELETE USER
router.delete("/:id", function(req, res) {
  console.log('testing delete');
  User.findById(req.params.id).then(function(user, err) {
    console.log('testing findById function');
    if (err) {
      console.log(err);
    } else if (user.id == req.params.id) {
      console.log(user.id);
      console.log(req.params.id);
      console.log('it should be deleting if I see this');
      user.destroy();
      res.send(true);
    } else {
      console.log("something else is up");
    }
  });
});

// router.get('/:id', function(req,res){
//   console.log('testing show user');
//   User.findById(req.params.id, function(err,user){
//     if (err) {
//       console.log(err);
//     } 
//     console.log(req.params)
//     res.json(user);
//   });
// });
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

// SHOW USER
// router.get('/:id', function(req,res){
//   console.log('testing show user');
//   User.findById(req.params.id, function(err,user){
//     if (err) {
//       console.log(err);
//     } 
//     console.log(req.params)
//     res.json(user);
//   });
// });

module.exports = router;