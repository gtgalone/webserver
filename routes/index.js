var express = require("express");
var router = express.Router();
var passport = require("../config/passport");

// index
router.get("/", function(req, res){
  res.render("index");
});

// about
router.get("/about", function(req, res){
  res.render("about");
});

// portfolie
router.get('/portfolio', function(req, res){
  res.render('portfolio');
});

// login
router.get("/login", function (req, res) {
  var errors = req.flash("errors")[0] || {};
  var username = req.flash("username")[0];
  res.render("users/login", {
    username:username,
    errors:errors
  });
});

// post login
router.post("/login",
  function(req, res, next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = "아이디를 입력해주세요";
    }
    if(!req.body.password){
      isValid = false;
      errors.password = "비밀번호를 입력해주세요";
    }

    if(isValid){
      next();
    } else {
      req.flash("errors",errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
  }
));




// Google login
router.get('/auth/google',
  passport.authenticate('google', { scope: [ 'profile', 'email' ] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });




// Facebook login
router.get('/auth/facebook',
  passport.authenticate('facebook', {scope:['email']}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
  }
);


// logout
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
