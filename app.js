import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
// import favicon from 'serve-favicon';
import path from 'path';
import lessMiddleware from 'less-middleware';

import mongoose from 'mongoose';
import passport from 'passport';

import index from './routes/index';
import auth from './routes/auth';
import preference from './routes/preference';

dotenv.load({path: '.env'});

// Connect to mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.REMOTEDB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});


const app = express();
const debug = Debug('fin-tail-backend:app');
const server = require('http').Server(app);
/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/preference', preference);
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = require('connect-mongo')(session);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "WDI Singapore",
  store: new MongoStore({
    url: 'mongodb://localhost/Fintail',
    autoReconnect: true,
    clear_interval: 3600
  })
}));

/* Make passport for app to access .Passport will update user session with auntethication*/
app.use(passport.initialize());
app.use(passport.session());

/*Routes that is used for app*/
app.use('/', index);
app.use('/auth', auth);



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});

server.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:' + app.get('port')); 
});

export default app;
