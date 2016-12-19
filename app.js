const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const async = require('async');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const pug = require('pug');

// database
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection;
db.once('open',function () {
  console.log('DB connected!');
});
db.on('error',function (err) {
  console.log('DB ERROR :', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '52428800' }));
app.use(bodyParser.urlencoded({ limit: '52428800', extended: true }));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser());
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
  secret:'MySecret',
  resave:false,
  saveUninitialized:false,
  store: new mongoStore({
    url:process.env.MONGO_DB,
    ttl:24 * 60 * 60
  })
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.pageQuery = req.query.page;
  res.locals.path = req.path;
  res.locals.ip = req.headers['x-appengine-user-ip'];
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));
// app.get('/', function(req,res){
//   req.flash('test', 'Flash is back!');
//   res.redirect('/test');
// });
//
// app.get('/test', function(req,res){
//   res.send(JSON.stringify(req.flash('test')[0])) });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({'500 server error':err.message});
});

// counter
function visitors(req,res,next){
  if(!req.cookies.count&&req.cookies['connect.sid']){
    res.cookie('count', '', { maxAge: 3600000, httpOnly: true });
    var now = new Date();
    var date = now.getFullYear() +'/'+ now.getMonth() +'/'+ now.getDate();
    if(date != req.cookies.countDate){
      res.cookie('countDate', date, { maxAge: 86400000, httpOnly: true });

      var Counter = require('./models/Counter');
      Counter.findOne({name:'visitors'}, function (err,counter) {
        if(err) return next();
        if(counter===null){
          Counter.create({name:'visitors',totlaCount:1,todayCount:1,date:date});
        } else {
          counter.totalCount++;
          if(counter.date == date){
            counter.todayCount++;
          } else {
            counter.todayCount = 1;
            counter.date = date;
          }
          counter.save();
        }
      });
    }
  }
  return next();
}

module.exports = app;
