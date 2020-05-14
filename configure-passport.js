'use strict';

// Passport Strategy configuration

const passport = require('passport');
const passportLocal = require('passport-local');
const passportGithub = require('passport-github');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const LocalStrategy = passportLocal.Strategy;
const GithubStrategy = passportGithub.Strategy;


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
  new LocalStrategy({}, (username, password, callback) => {
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
  new LocalStrategy({}, (username, password, callback) => {
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
          return Promise.reject(new Error('Password is incorrect, please try again'));
        }
      })
      .catch(error => {
        callback(error);
      });
  })
);


passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/authentication/github-callback',
      scope: 'user'
    },
    (accessToken, refreshToken, profile, callback) => {
      console.log(profile);
      const name = profile.displayName;
      const email = profile.emails ? profile.emails[0].value : null;
      const photo = profile._json.avatar_url;
      const githubId = profile.id;

      User.findOne({
        githubId
      })
        .then(user => {
          if (user) {
            return Promise.resolve(user);
          } else {
            return User.create({
              name,
              email,
              photo,
              githubId
            });
          }
        })
        .then(user => {
          callback(null, user);
        })
        .catch(error => {
          callback(error);
        });
    }
  )
);