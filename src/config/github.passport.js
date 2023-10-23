import passport from "passport";
import GithubStrategy from "passport-github2"; 
import { createHash } from "../utils.js"; 
import SessionService from "../services/session.service.js";
import CartService from "../services/carts.service.js";
import config from "../config.js";
   
const sessionService=new SessionService();
const cartService=new CartService();
 
export const initializePassportGithub = () => {
  passport.use("github",
    new GithubStrategy(
      {
        clientID: config.GITHUB_CLIENT_ID,  
        clientSecret: config.GITHUB_CLIENT_SECRET,        
        callbackURL: config.GITHUB_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        let emailgithub=profile._json.email;
        let user= await sessionService.getUserByIdService(emailgithub);
        if (!user) {
          const carrito=await cartService.createCartService();
          let newUser = {
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            age: 32,
            cart: carrito,
            password: createHash("1234"),
            role: 'user'
          };

          const result = await sessionService.registerService(newUser);
          done(null, result, {message: "Se crea un usuario nuevo, con los datos traidos desde Github"});
        } else {
          done(null, user, {message: "El user ya existe en la DB - logueado con éxito"});
        }
      }
    )
  );
  
};

