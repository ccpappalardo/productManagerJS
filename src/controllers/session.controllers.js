//import UserManager from "../daos/mongodb/daos/UserManager.class.js";
import SessionService from "../services/session.service.js";
import { createHash, validatePassword} from "../../src/utils.js";
import jwt from 'jsonwebtoken' 
import config from "../config.js"; 
import Mail from "../helpers/mail.js";

export default class SessionController{ 

  
  constructor(){
    this.sessionService=new SessionService()
    this.mail = new Mail()
  }

  
async registerController(){
 // const result=await this.sessionService.registerService();
  //return result;
  res.send({status:"success", message: "Usuario registrado"});
}


async loginController(req,res){

  //Seteo el token
 const user={
   nombre: `${req.user.first_name} - ${req.user.last_name}`,
   email: req.user.email,
   edad: req.user.age,
   role: req.user.role,
   id: req.user._id,
   cart: req.user.cart
   } 
   
   let token = jwt.sign(user, config.JWT_SECRET, {
    expiresIn: "24h",
  });
   
  res.cookie("coderCookie", token, { httpOnly: true }).send({ status: "success", user: user });
   
 } 

async loginFailController(req, res) {
 console.log("Fallo la autenticación del login");
 res.status(400).send({status: "error", error: "Fallo la autenticación del login"})
}
 
async registerFailController(res) {
  console.log("Fallo la autenticación");
  res.status(400).send({status: "error", error: "Fallo la autenticación"})
}

async getCurrentController(req, res) {
    const result=await this.sessionService.getCurrentService(req, res);
    //res.send(req.user);
    res.send(result);
}


async logoutController(res){
  await this.sessionService.logoutService(res)

 }

 
//llama a github
async githubController(){
  await  this.sessionService.githubService();
}
//ruta callback que vuelve a github 
async githubcallbackController(req, res){

  //Seteo el token
  const usuario={
    nombre: `${req.user.first_name} - ${req.user.last_name}`,
    email: req.user.email,
    edad: req.user.age,
    role: req.user.role,
    id: req.user._id,
    cart:req.user.cart
    }
    await this.sessionService.githubcallbackService(usuario,res);   
}
 
async resetPasswordController(req,res){

  const {email,password} = req.body;
console.log(email, password)
 if(!email||!password) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
  const user = await this.sessionService.getUserByIdService(email);
  
  //await managerUsers.getUserById(email);
  if(!user) return res.status(404).send({status:"error",error:"El usuario no se encuentra registrado"});
  
  try{
    
    if(password==password.user) return res.status(400).send({status:"error",error:"La contraseña es igual a la anterior"});

    const newHashedPassword = createHash(password);
    const result=await this.sessionService.resetPasswordService(user._id,newHashedPassword);
    return result;
    //res.send({status:"success",message:"Contraseña restaurada"});
  }catch(error){
    return res.status(404).send({status: "error", error: error.message});
  }
}

  async requestResetPasswordController(req,res){

    const {email} = req.body;
    console.log(email)
    if(!email) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
    const user = await this.sessionService.getUserByIdService(email);
    
    //await managerUsers.getUserById(email);
    if(!user) return res.status(404).send({status:"error",error:"El usuario no se encuentra registrado"});
    
    try{
      console.log("Entro a mandar el emailssssssssss");
      
      let tokenReset = jwt.sign({email}, config.TOKEN_RESET, {
        expiresIn: "1h",
      });

      
      let html = `<h1>Correo de Recuperación de Contraseña - ${email}</h1>`
      html = html.concat(
        `<div><h1>Restaura tu contraseña haciendo click en el siguiente link</h1> 
      http://localhost:8080/resetPassword?token=${tokenReset}</div>`);
     
     const result = this.mail.send(email, "Correo de Recuperación de Contraseña", html);
      return result; 
    }catch(error){
      return res.status(404).send({status: "error", error: error.message});
    }
  }

  async cambiarRolController(req,res){
    try {
      let id = req.params.uid
      let user = await this.sessionService.getUserService(id);

      if(user.role=="user"){
        await this.sessionService.updateUserRoleService(id, "premium");
        return res.send({status: "success", message: "Rol de Usuario actualizado a Premium"});
      }else if(user.role=="premium"){
        await this.sessionService.updateUserRoleService(id, "user");
        return res.send({status: "success", message: "Rol de Premium actualizado a Usuario"});
      }else{
        return res.status(400).
        send({status: "failure", details: "No puede cambiar de Rol."})
      }
  
    }
    catch (error) {
      return res.status(404).send({status: "error", error: error.message});
    }
  }
 
}
