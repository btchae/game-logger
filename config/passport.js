var LocalStrategy = require('passport-local').Strategy;

//load the user model
var Sequelize = require('sequelize');
var pg = require('pg');
var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);
var User = sequelize.import('../models/user.js');
User.sync();

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

//used to serialize the user
passport.serializeUser(function(user, done){
  done(null, user.id);
});

//used to deserialize user
passport.deserializeUser(function(id,done){
  User.findById(id).then(function(user){
    done(null, user);
  }).catch(function(e){
    done(e, false);
  });
});

//Login
passport.use('local-login', new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password',
  passReqToCallBack: true //allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, username, password, done){
  User.findOne({ where: {username: username }})
  .then(function(user){
    if (!user) {
      done(null, false, req.flash('loginMessage', 'Unknown user'));
    } else if(!user.validPassword(password)){
      done(null, false, req.flash('loginMessage', 'Wrong password'));
    } else {
      done(null, user);
    }
  })
  .catch(function(e){
    done(null, false, req.flash('loginMessage',e.name + " " + e.message));
  });
}));

//Signup
passport.use('local-signup', new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password',
  passReqToCallBack: true
},
function(req, username, password, done){
  User.findOne({ where: {username: username }})
  .then(function(existingUser) {
    //Checks if username is already taken
    if (existingUser)
      return done(null, false, req.flash('loginMessage', 'That email is already taken.'));

    //If Logged in, connect the newly made account
    if (req.user) {
      var user = req.user;
      user.username = username;
      user.password = password;
      user.save().catch(function(err){
        throw err;
      }).then (function() {
        done(null, user);
      });
    }

    else {
      //create user
      var newUser = User.build({username: username, password: User.generateHash(password)});
      newUser.save().then(function() {done (null, newUser);}).catch(function(err) { done(null, false, req.flash('loginMessage', err));});
    }
  })
  .catch(function(e) {
    done(null, false, req.flash('loginMessage',e.name + " " + e.message));  
  })
}));

module.exports = passport;