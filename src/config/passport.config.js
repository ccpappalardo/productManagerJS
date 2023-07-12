import passport from "passport";
import GithubStrategy from "passport-github2"; 
import UserManager from "../../daos/mongodb/UserManager.class.js";
import LocalStategy from "passport-local"
import { createHash } from "../utils.js";


const managerUsers = new UserManager();

export const intializePassport = () => {
  passport.use("github",
    new GithubStrategy(
      {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
      },
      async (accessToken, refreshToken, profile, done) => {
        let emailgithub=profile._json.email;
        let user= await managerUsers.getUserById(emailgithub);
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: profile._json.name,
            email: profile._json.email,
            age: 32,
            password: createHash("1234"),
          };

          const result = await managerUsers.addUser(newUser);
          console.log("Se crea un usuario nuevo, con los datos traidos desde Github")
          console.log(result)
          done(null, result);
        } else {
          console.log("El user ya existe en la DB - Lo loguea")
          done(null, user);
        }
      }
    )
  );

  passport.use("register",
  new LocalStategy(
    {passReqToCallback:true, usernameField: 'email'}, async(req, username, password, done)=>{
      const {first_name, last_name, email, age}= req.body;
      console.log(email);
      try{
      
      let user=await managerUsers.getUserById(email);
      if(user){
        console.log("El usuario ya existe");
         return done(null, false);
      }
       let newUser = {
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),
            };
      let result=await managerUsers.addUser(newUser);
      return done(null, result);
      }catch(error){
      return done("Error al obtener el usuario "+error);
      }
    }
  )
);


  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await managerUsers.getUser(id);
    done(null, user);
  });
};
