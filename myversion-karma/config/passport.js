const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const UserModel = require('../models/user.js');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      UserModel.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    console.log('===============  passport file')
    console.log(user)
    console.log('===============')
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('=============== passport file   ID')
    console.log(id)
    console.log('===============')
    UserModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
