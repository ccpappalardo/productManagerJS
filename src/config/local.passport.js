import passport from "passport";
import local from "passport-local"
import { createHash, validatePassword } from "../utils.js";
import CartService from "../services/carts.service.js";
import SessionService from "../services/session.service.js";
import config from "../config.js";

const LocalStrategy=local.Strategy;

const sessionService=new SessionService();
const cartService=new CartService();
 
export const intializePassport = () => { 
  
  //Estrategia Local para Registracións
  passport.use("register",
  new LocalStrategy(
    {passReqToCallback:true, usernameField: 'email'}, async(req, username, password, done)=>{
      const {first_name, last_name, email, age}= req.body;
      console.log(email);
      try{
      
      let user=await sessionService.getUserByIdService(email);
      if(user){
        console.log("El usuario ya existe");
         return done(null, false, {message: "El Usuario ingresado, ya existe!"});
      }
       const carrito=await cartService.createCartService();
     
       let newUser = {
              first_name,
              last_name,
              email,
              age,
              //cart: carrito,
              password: createHash(password),
            };
      let result=await sessionService.registerService(newUser);
      return done(null, result, {message: "Usuario Registrado con éxito!"});
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
        
          //Controlo si el Usuario es el Admin de coder
          //if(username=='adminCoder@coder.com'){
            if(username==config.ADMIN_NAME){
            let user = {
            first_name: "Admin",
            last_name: "Coder",
            age: "25",
            //email: "adminCoder@coder.com",
            email: config.ADMIN_NAME,
            //password: "adminCod3r123",
            password: config.ADMIN_PASSWORD,
            rol: "admin"
            };
            return done(null, user,  {message: "Usted se ha logueado como Coder Admin!"});
          }

          //Si es user común - lo busco en la DB -  controlo pass 
          let user=await sessionService.getUserByIdService(username);
          if(user){
            if(!validatePassword(password, user)){
              console.log("Contraseña incorrecta");
              return done(null, false, {message: "Contraseña Incorrecta!"});
            }else{
            console.log("Se loguea correctamente");
            return done(null, user, {message: "El usuario se loguea correctamente"});
            }
        } 
      }catch(error){
      return done("Error al obtener el usuario "+error);
      }
    }
  )
  );
 
};

