var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URL || "postgres://localhost/game_logger";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

// console.log("in users")
var User = connection.define('users', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false 
  },
  email: {
    type: Sequelize.STRING, 
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING
  }
}, // this is how I can hash passwords using sequelize and add instance methods
{
  hooks: {
    afterValidate: function(user) {
      user.password = bcrypt.hashSync(user.password, 10);
    }
  },
  instanceMethods: {
    authenticate: function(passwordTry) {
      return bcrypt.compareSync(passwordTry, this.password);
    }
  }
});

var Game = connection.define('games', {
  title: {
    type: Sequelize.STRING,
    allowNull: false 
  },
  image: {
    type: Sequelize.TEXT, 
    allowNull: true
  },
  deck: {
    type: Sequelize.TEXT,
    allowNull: true
  }, 
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  platforms: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true
  },
  ratings: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true
  }
});

User.hasMany(Game);
Game.belongsTo(User);

User.sync();
Game.sync();

module.exports ={
user: User,
game: Game
}