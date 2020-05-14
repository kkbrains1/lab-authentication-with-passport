'use strict';

// Passport Strategy configuration

const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const PassportLocalStrategy = passportLocal.Strategy;


//iteration 0: define a serialization and deserialization process.

passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((userId, callback) => {
  User.findById(userId)
    .then(user => {
      callback(null, user);
    })
    .catch(error => {
      callback(error);
    });
});

// IT 1 To make everything work, you need to create a sign-up authentication strategy on the configure-passport.js file. Remember, you configure a strategy in passport by having the following:


passport.use(
  'sign-up',
  new PassportLocalStrategy({}, (username, password, callback) => {
    // Perform your authentication logic and call the callback function,
    // passing it null in the first parameter and the user document in the second
    bcrypt
      .hash(password, 8)
      .then(HAndS => {
        return User.create({
          username,
          passwordHash: HAndS
        });
      })
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  })
);

passport.use(
  'sign-in',
  new PassportLocalStrategy({}, (username, password, callback) => {
    let user;
    User.findOne({
      username
    })
      .then(result => {
        user = result;
        return bcrypt.compare(password, user.passwordHash);
      })
      .then(comparison => {
        if (comparison) {
          callback(null, user);
        } else {
          return Promise.reject(new Error('Password is incorrect, pelase try again'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);


