const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors')
const app = express();
var router = express.Router()
const helmet = require('helmet');

app.use(cors());
//secure your Express apps by setting constious HTTP headers
app.use(helmet());
// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // expires: 600000
  }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// app.use(express.static(__dirname + '/assets'));
app.use('/assets', express.static(__dirname + "/assets"));


app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//-------------------------------------------------------------//
//-------------------------------------------------------------//
//-------------------------------------------------------------//
// import all routes at once
require("./server/utilities/routes.utility")(app);

require('./server/middlewares/error_handler.middleware')(app);
// module.exports = app;
module.exports = {
  app,
  router
};