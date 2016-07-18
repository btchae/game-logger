//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var User = require('../models/users.js').user;
var Game = require('../models/users.js').game;
var passport = require('../config/passport.js');

//INDEX
router.get('/', function(req, res) {
  console.log('testing game controller');
  Game.findAll().then(function(games, err) {
    if (err) {
      console.log(err);
    } else {
      console.log(games[0].user);
      res.json(games);
    }
  });
});

//SEED
router.get('/seed', function(req, res) {
  console.log('testing game seed');
  Game.create({ title: 'test-game', userId: 4 });
});

// -----------------------------------------------
// ROUTES THAT REQUIRE AUTHENTICATION w/ JWT BELOW
// -----------------------------------------------
router.use(passport.authenticate('jwt', { session: false }));

//SHOW
router.get('/:id', function(req, res) {
  Game.findById(req.params.id).then(function(game, err) {
    if (err) {
      console.log(err);
    } else {
      // console.log(project);
      res.json(game);
    }
  });
});

module.exports = router;