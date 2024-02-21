var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render("profile");
});


router.get('/register', function(req, res, next) {
  res.render("register");
});

router.post('/register', function(req, res, next) {
  const data = userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact
  })
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
});

router.get('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req, res, next) {});

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  redirect('/');
}

module.exports = router;
