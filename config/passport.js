var passport      = require("passport");
var LocalStrategy = require("passport-local");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User          = require("../models/User");

// serialize & deserialize User
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({ _id:id }, function(err, user) {
    done(err, user);
  })
});

// local strategy
passport.use("local",
  new LocalStrategy({
      usernameField : "username",
      passwordField : "password",
      passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({username:username})
      .select({password})
      .exec(function(err, user) {
        if (err) return done(err);

        if (!user){
          req.flash("errors", {loginu:"Incorrect username or password"});
          return done(null, false); console.log(user);
        }
        if (user && user.authenticate(password)){
          return done(null, user);
        } else {
          req.flash("username", username);
          req.flash("errors", {loginp:"Incorrect password"});
          return done(null, false);
          }
      });
    }
  )
);

// Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GGID,
  clientSecret: process.env.GGPW,
  callbackURL: 'http://www.gtgalone.com/auth/google/callback'
}, function(accessToken, refreshToken, profile, done) {
  var providerData = profile._json;
  providerData.accessToken = accessToken;
  providerData.refreshToken = refreshToken;

  User.findOrCreate({ username: profile.id }, {
    username: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    provider: 'google',
    providerId: profile.id,
    providerData:providerData
  }, function(err, user) {
    return done(err, user);
  });
}));


// Facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FBID,
  clientSecret: process.env.FBPW,
  callbackURL: 'http://www.gtgalone.com/auth/facebook/callback',
  profileFields:['id','emails','gender','link','locale','displayName','timezone','updated_time','verified']
},
function(accessToken, refreshToken, profile, done) {
  var providerData = profile._json;
  providerData.accessToken = accessToken;
  providerData.refreshToken = refreshToken;

  User.findOrCreate({ username: profile.id }, {
    username: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
    provider: 'facebook',
    providerId: profile.id,
    providerData:providerData
  }, function(err, user) {
    return done(err, user);
  });
}));


module.exports = passport;
