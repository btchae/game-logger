//REQUIREMENTS
var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/social_app_dev";
var connection = new Sequelize(db);
var User = require('../models/users.js').user;
var Game = require('../models/users.js').game;
var passport = require('../config/passport.js');
var request = require('request');
//INDEX
router.get('/', function(req, res) {
  console.log('testing game controller');
  Game.findAll().then(function(games, err) {
    if (err) {
      console.log(err);
    } else {
      // console.log(games[0].user);
      res.json(games);
    }
  });
});
router.get('/search/:query', function(req, res) {
  console.log('making API call')
  request('http://www.giantbomb.com/api/search/?api_key='+process.env.GIANT_BOMB_API+'&format=json&limit=10&query='+req.params.query+'&resources=game', function(error, response, body) {
    if (!error) {
      console.log('API Data below');
      // console.log(typeof body); Data from giant bomb is a string. Need to parse.
      // console.log(body);
      res.json(JSON.parse(body));
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

//Create game is not here because I need the user ID to associate it with a user.

//UPDATE GAME
router.put('/:id', function(req, res) {
  console.log('testing update game');
  Game.findById(req.params.id).then(function(game, err) {
    if (err) {
      console.log(err);
    } else {
        game.create({
          title: req.body.title,
          image: req.body.image,
          deck: req.body.deck,
          description: req.body.description,
          platforms: req.body.platforms,
          ratings: req.body.ratings
      });
    }
  });
});
//DELETE GAME
router.delete('/:id', function(req, res) {
  console.log('testing delete game route');
  Game.findById(req.params.id).then(function(game, err){
    if (err) {
      console.log(err);
    } else if (req.params.id == game.id) {
      console.log('game should be deleting');
      game.destroy
      res.send(true);
    } else {
      console.log('Your princess is in another castle');
    }
  });
});

module.exports = router;