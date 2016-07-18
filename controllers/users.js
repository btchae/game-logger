//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URL || "postgres://localhost/game_logger";
var connection = new Sequelize(db);
var User = require('../models/users.js').user;
var Game = require('../models/users.js').game;
var passport = require('../config/passport.js');
User.sync();
Game.sync();
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

// router.get('/', function(req, res) {
//   console.log('testing index');
//   User.findAll({include: [Game]}.then(function(users,err) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(users);
//     }
//   });
// });
// INDEX
router.get('/', function(req, res) {
  User.findAll({include: [Game]}).then(function(users, err) {
    if (err) {
      console.log(err);
    } else {
      // console.log(users[0].games); Need to add the "include" in order to get games from the users
      // console.log(users);
      res.send(users);
    }
  });
});

router.get('/seed', function(req, res) {
  console.log('testing seed');
  User.create({username: 'test3', email: 'test3', password: 'test3'});
});

// USER SHOW
router.get("/:id", function(req, res) {
  var response_data = {user: '', games: ''};
  User.findById(req.params.id).then(function(user, err) {
    if (err) {
      console.log(err);
    } else {
      response_data.user = user;
      Game.findAll({where: {userId: req.params.id}}).then(function(games) {
        response_data.games = games;
        res.json(response_data);
      })
      // console.log(user.games);
    }
  });
});

// GAME SHOW
router.get('/:id/')

//UPDATE USER
router.put("/:id", function(req, res) {
  console.log('testing update user');
  console.log(req.body);
  User.findById(req.params.id).then(function(user, err) {
    if (err) {
      console.log(err);
    } else {
      console.log(user.username);
      console.log(user.email);
      console.log(user.password);
      user.update({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
      res.json(user);
    }
  });
});

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

//ADD GAME TO USER
router.post('/:id/add-game', function(req, res) {
  console.log('adding new game');
  console.log(req.body);
  Game.create({
    title: req.body.title,
    image: req.body.image,
    deck: req.body.deck,
    description: req.body.description,
    platforms: req.body.platforms,
    userId: req.params.id
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