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
    
      try{
      let user=await sessionService.getUserByIdService(email);
      if(user){
         return done(null, false, {message: "El Usuario ingresado, ya existe!"});
      }
       const carrito=await cartService.createCartService();
      let newUser = {
              first_name,
              last_name,
              email,
              age,
              cart: carrito,
              password: createHash(password),
              role:"user",
              documents:[
                    {
                        name:"adress",
                        reference:""                    
                    },
                    {
                        name:"identification",
                        reference:""                    
                    },
                    {
                    name:"accountStatus",
                    reference:""                    
                    }
                ]
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
     
          try{
        
          //Controlo si el Usuario es el Admin de coder
            if(username==config.ADMIN_NAME && password==config.ADMIN_PASSWORD){
            let user = {
            first_name: "Admin",
            last_name: "Coder",
            age: "25",
            email: config.ADMIN_NAME,
            password: config.ADMIN_PASSWORD,
            role: "admin",
            last_connection: Date.now()
            };
            return done(null, user,  {message: "Usted se ha logueado como Coder Admin!"});
            } 

          //Si es user común - lo busco en la DB -  controlo pass 
          let user=await sessionService.getUserByIdService(username);
          
          if (!user) {
            return done(null, false)
          }
          
          if(user){
            if(!validatePassword(password, user)){
              return done(null, false, {message: "Contraseña Incorrecta!"});
            }else{
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

