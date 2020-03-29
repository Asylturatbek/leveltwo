const GoogleStrategy = require('passport-google-oauth20').Strategy;
// Load User model
const UserModel = require('../models/user.js');
//.env config
const dotenv = require('dotenv')
dotenv.config();

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.CLIENT_ID  ,
      clientSecret: process.env.CLIENT_SECRET ,
      callbackURL: '/student/loginGoogle/redirect'
    }, (request, accessToken, refreshToken, profile, done) => {
      // 
        UserModel.findOne({email: profile._json.email}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                done(null);
            }
        });
    })
  );

  // passport.serializeUser((user, done) => {
  //     done(null, user.id);
  // });

  // passport.deserializeUser((id, done) => {
  //     UserModel.findById(id).then((user) => {
  //         done(null, user);
  //     });
  // });
};
