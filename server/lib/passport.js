const  JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const User= require("../models/users_model")

const secert_key= process.env.JWT_SECRET;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
     secretOrKey: secert_key ,
    algorithms: ['HS256']
  };
  
  // app.js will pass the global passport object here, and this function will configure it
  module.exports = (passport) => {
      console.log("passport is called")
 
      // The JWT payload is passed into the verify callback
      passport.use(new JwtStrategy(options, (jwt_payload, done)=> {
console.log("new strategy")
         
          
          // We will assign the `sub` property on the JWT to the database ID of user
          User.findOne({_id: jwt_payload.user._id}, (err, user)=> {
             
              // This flow look familiar?  It is the same as when we implemented
              // the `passport-local` strategy
              if (err) {
                  return done(err, false);
              }
              if (user) {
                  return done(null, user);
              } else {
                  return done(null, false);
              }
              
          });
          
      }
     ));
  }