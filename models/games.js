var express = require('express');
var Sequelize = require("sequelize");
var db = process.env.DATABASE_URI || "postgres://localhost/game_logger";
var connection = new Sequelize(db);
var bcrypt = require('bcryptjs');
var crypto = require('crypto');

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

var table = function() {
  console.log('testing table');
    Game.sync().then(function() {
    //Table created
    console.log("Game Table Created");
  });
};

module.exports = {
  model: Game,
  table: table
};