import passport from "passport";
import GithubStrategy from "passport-github2"; 
import { createHash } from "../utils.js";
import UserManager from "../../daos/mongodb/UserManager.class.js";
import ManagerCarts from "../../daos/mongodb/CartManager.class.js";
 
const managerUsers = new UserManager();
const managerCarts=new ManagerCarts();
export const initializePassportGithub = () => {
  passport.use("github",
    new GithubStrategy(
      {
        clientID: "Iv1.a3089b6e9aef8445", 
        clientSecret: "3559a68a6044c7ae0e7822aa0940479e51c08527", 
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        let emailgithub=profile._json.email;
        let user= await managerUsers.getUserById(emailgithub);
        if (!user) {
          const carrito=await managerCarts.addCart();
          let newUser = {
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            age: 32,
            cart: carrito,
            password: createHash("1234"),
          };

          const result = await managerUsers.addUser(newUser);
          console.log("Se crea un usuario nuevo, con los datos traidos desde Github")
          console.log(result)
          done(null, result, {message: "Se crea un usuario nuevo, con los datos traidos desde Github"});
        } else {
          console.log("El user ya existe en la DB - Lo loguea")
          done(null, user, {message: "El user ya existe en la DB - logueado con éxito"});
        }
      }
    )
  );
  
};

