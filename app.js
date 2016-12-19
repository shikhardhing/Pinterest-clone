//Module dependencies.
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('node-twitter-api');
const errorhandler = require('errorhandler')
const compression = require('compression')
const chalk = require('chalk');
const livereload = require('livereload');
const dotenv = require('dotenv');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
//const multer = require('multer');
//const upload = multer({ dest: path.join(__dirname, 'uploads') });


//Load environment variables from .env file, where API keys and passwords are configured.
dotenv.load({ path: '.env' });

//Controllers (route handlers).
const apiController = require('./controllers/api');
const userController = require('./controllers/user');
const picController = require('./controllers/pic');

const app = express();

//Connect to MongoDB.
mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

//Express configuration.
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // After successful login, redirect back to the intended page
  console.log(req.user);
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.get('/',picController.index)
app.get('/myPics',picController.myPics)

app.get('/login',userController.login)
app.get('/callback',userController.callback)
app.get('/getcookie',userController.getCookie)
app.get('/logout',userController.logout)

app.post('/api/img',apiController.addImg)
app.delete('/api/img/:id',apiController.deleteImg)
//app.get('/api/img',apiController.getImg)


if (process.env.NODE_ENV === 'development') {  // only use in development
  app.use(errorhandler({ dumpExceptions: true, showStack: true }))
}

//Start Express server.
app.listen(app.get('port'), () => {
  console.log('%s Express server listening on port %d in %s mode.', chalk.green('✓'), app.get('port'), app.get('env'));
});

const lrserver = livereload.createServer();
lrserver.watch(__dirname + "/public",__dirname+"/views");

module.exports = app;
