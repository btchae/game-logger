
//=========================
// REQUIREMENTS
//=========================
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 3000;
var db = process.env.DATABASE_URI || "postgres://localhost/game_logger";
var Sequelize = require("sequelize");
var pg = require('pg');

//=========================
// MIDDLEWARE
//=========================
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());



//=========================
// DATABASE
//=========================

//Postgress
var client = new pg.Client(db);
client.connect();

//Sequelize
var sequelize = new Sequelize(db);
sequelize.authenticate().then(function(err) {
  if (err) {
    console.log("Unable to connect to the database: " + err);
  } else {
    console.log("connection to db successful");
  }
})

//=========================
// CONTROLLERS
//=========================
var usersController = require('./controllers/users.js');
app.use('/users', usersController);
var gamesController = require('./controllers/games.js');
app.use('/games', gamesController);
var authController = require('./controllers/auth.js')
app.use('/auth', authController);

//=========================
// LISTEN
//=========================
app.listen(port);
console.log('=============================');
console.log('Our band is called PORT: ' + port);
console.log('=============================');