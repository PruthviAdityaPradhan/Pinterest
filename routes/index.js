var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require('./multer');
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/fileupload',isLoggedIn, upload.single("Image"),async function(req, res, next) {
 const user = await userModel.findOne({username : req.session.passport.user})
 user.profileImage = req.file.filename;
 await user.save();
 res.redirect("/profile");
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username : req.session.passport.user})

  res.render("profile",{user});
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

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  redirect('/');
}

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



module.exports = router;
