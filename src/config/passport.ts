import passport from "passport";

import passportJwtStrategy from "passport-jwt";

// types -->
import type { ErrorRequestHandler } from "express";
import { IUser } from "app/types/modelTypes";
import User from "app/models/user";

const JwtStrategy = passportJwtStrategy.Strategy;
const ExtractJwt = passportJwtStrategy.ExtractJwt;
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, function (jwt_payload, done) {
    User.findById(
      jwt_payload.user._id,
      { lean: true },
      function (err: ErrorRequestHandler, user: IUser) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      }
    );
  })
);
