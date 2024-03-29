import passport from "passport";
import jwt from "passport-jwt";
import config from "../config.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassportJWT = () => {

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  
  passport.use(
    "jwtRequestPassword",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([queryExtractor]),
        secretOrKey: config.TOKEN_RESET,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (e) {
          return done(e);
        }
      }
    )
  );


};


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["coderCookie"];
    }
    return token
  };


  const queryExtractor = (req) => {
    let token = null;
    if (req.query) {
      token = req.query.token;
    }
    return token
  };
