'use strict';

const { Router } = require('express');
const authenticationRouter = Router();

const passport = require('passport');

//const routeGuard = require('./../middleware/route-guard');

//Iteration #1: The Sign Up Feature

//Add a new route handler to your /routes/authentication.js file with the endpoint /sign-up and make it render the template in the /views/authentication/sign-up.hbs file.

authenticationRouter.get('/sign-up', (req, res, next) => {
  res.render('authentication/sign-up');
});

// IT 1 Finally, add a POST route handler to your /router/authentication.js to receive the data from the Sign Up form and create a new user with the data.

// IT 1 Afterwards, you need to pass a call to passport.authenticate('sign-up', { /* ...options */}) to the route handler for the sign-up route.

authenticationRouter.post('/sign-up', 
  passport.authenticate('sign-up', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-up'
  })
);

authenticationRouter.get('/sign-in', (req, res, next) => {
  res.render('authentication/sign-in');
});

authenticationRouter.post('/sign-in', 
  passport.authenticate('sign-in', {
    successRedirect: '/',
    failureRedirect: '/authentication/sign-up'
  })
);

authenticationRouter.get('/github', 
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

authenticationRouter.get('/github-callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/error'
  })
);

authenticationRouter.post('/sign-out', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = authenticationRouter;


