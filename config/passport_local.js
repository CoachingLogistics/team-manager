var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').strategy;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 77;

var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.cookieParser());//passport
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({secret:'my secret phrase'}));//passport

      // Remember Me middleware
    app.use( function (req, res, next) {
        if ( req.method == 'POST' && req.url == '/login' ) {
            if ( req.body.rememberme ) {
                req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
            } else {
                req.session.cookie.expires = false;
            }
        }
        next();
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);




    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });
  });
};



passport.serializeUser(function(user, done) {
  var createAccessToken = function () {
    var token = user.generateRandomToken();
    User.findOne( { accessToken: token }, function (err, existingUser) {
      if (err) { return done( err ); }
      if (existingUser) {
        createAccessToken(); // Run the function again - the token has to be unique!
      } else {
        user.set('accessToken', token);
        user.save( function (err) {
          if (err) return done(err);
          return done(null, user.get('accessToken'));
        })
      }
    });
  };
  if ( user._id ) {
    createAccessToken();
  }
});


passport.deserializeUser(function(token, done) {
  User.findOne( {accessToken: token } , function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));











