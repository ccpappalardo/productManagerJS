import passport from "passport";
import GithubStrategy from "passport-github2"; 
import UserManager from "../../daos/mongodb/UserManager.class.js";
import local from "passport-local"
import { createHash, validatePassword } from "../utils.js";

const LocalStrategy=local.Strategy;

const managerUsers = new UserManager();

export const intializePassport = () => {
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

  //Estrategia Local para Registracións
  passport.use("register",
  new LocalStrategy(
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
 

//Estrategia Local para el Login
  passport.use("login",
  new LocalStrategy(
    {passReqToCallback:true, usernameField: 'email'}, async(req, username, password, done)=>{
          console.log(username,password);
          try{
          let user=await managerUsers.getUserById(username);
          //Controlo si el Usuario es el Admin de coder
          /*if(username=='adminCoder@coder.com'){
            req.session.user = {
            name: "Admin Coder",
            email: "adminCoder@coder.com",
            password: "adminCod3r123",
            rol: "admin"
            };
            return done(null, user);
         
          }else{*/
             //Si es user común - controlo pass 
          if(user){
            if(!validatePassword(password, user)){
              console.log("Contraseña incorrecta");
              return done(null, false);
            }else{
            console.log("Se loguea correctamente");
            return done(null, user);
            }
        } 
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
