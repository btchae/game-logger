var User = require('../models/users.js').user;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtOpts = {};
// var pg = require('pg');
var db = process.env.DATABASE_URL || "postgres://localhost/game_logger";
// var client = new pg.Client(db);
// client.connect();
// var bcrypt = require('bcryptjs');

var util = require("util");
JwtOpts.jwtFromRequest = function(req) {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt_token'];
  }
  return token;
};


JwtOpts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(JwtOpts, function(jwt_payload, done) {
  console.log( "JWT PAYLOAD" + util.inspect(jwt_payload));
  User.find({where: {username: jwt_payload.username}}).then(function(result, err) {
    if (err) {
        return done(err, false);
    } else if (result) {
        console.log(result);
        console.log("user is " + result.username)
        done(null, result);
    } else {
        done(null, false);
    }
  });
}));

passport.use( new LocalStrategy (
  function( username, password, done ) {
    User.find({where: {username: username} }).then(function(dbUser, err) {
      // console.log("in passport, dbUser")
      // console.log(dbUser);

      if (err) { return done(err); }
      else if (!dbUser) {
        return done(null, false);
      }
      if (!dbUser.authenticate(password)) {
        return done(null, false, { message: 'Incorrect password.' });
        return done(null, false);
      }
      return done(null, dbUser);
    });
  }));

module.exports = passport;