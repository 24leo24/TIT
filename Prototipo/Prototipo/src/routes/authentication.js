const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('auth/signup');
  });

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/signin',
    failureRedirect: '/signup',
    failureFlash: true
  }));

router.get('/signin', (req,res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
  passport.authenticate('local.signin',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});


router.get('/profile', (req,res)=> {
    res.render('profile')
});

router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('../');
});

module.exports = router;