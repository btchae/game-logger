//Requirements
var express = require('express'); 
var app = express();
var port = process.env.PORT || 3000;
var passport = require('passport');
var flash = require('connect-flash'); // store and retrieve messages in session store
var morgan = require('morgan'); //logger
var cookieParser = require('cookie-parser'); // parse cookies
var bodyParser = require('body-parser'); // parse posts
var session = require('express-session');// session middleware
require('./config/passport'); // pass passport for configuration

//Middleware
app.use(morgan('dev'));// log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());// get information from html forms

//this Middleware is required for passport
app.use(session({ secret: 'zomaareenstukjetekstDatjenietzomaarbedenkt' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// app.set('view engine', 'ejs');  I might use ejs, or I might make it single page.

//Controllers
// var userController = require('./controllers/users.js');
require('./controllers/users.js')(app, passport);

//Listen
app.listen(port);
console.log('=============================');
console.log('The name of our band is PORT: ' + port);
console.log('=============================');