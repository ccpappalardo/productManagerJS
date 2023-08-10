//import UserManager from "../daos/mongodb/daos/UserManager.class.js";
import SessionService from "../services/session.service.js";
import { createHash} from "../../src/utils.js";

export default class SessionController{ 

  
  constructor(){
    this.sessionService=new SessionService()
  }

  
async registerController(){
 // const result=await this.sessionService.registerService();
  //return result;
  res.send({status:"success", message: "Usuario registrado"});
}


async loginController(req,res){
  //Seteo el token
 const usuario={
   nombre: `${req.user.first_name} - ${req.user.last_name}`,
   email: req.user.email,
   edad: req.user.age,
   rol: req.user.role,
   id: req.user._id
   }
   let result=await this.sessionService.loginService(usuario,req,res) 
   return result;
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
  await this.sessionService.getCurrentService(req,res);
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
    rol: req.user.role,
    id: req.user._id
    }
    await this.sessionService.githubcallbackService(usuario,res);   
}
 
async resetPasswordController(req,res){

  const {email,password} = req.body;
console.log(email, password)
 if(!email||!password) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
  const user = await this.sessionService.getUserByIdService(email);
  console.log("usuario en controller"+user)
  //await managerUsers.getUserById(email);
  if(!user) return res.status(404).send({status:"error",error:"El usuario no se encuentra registrado"});
  
  try{
    const newHashedPassword = createHash(password);
    const result=await this.sessionService.resetPasswordService(user._id,newHashedPassword);
    return result;
    //res.send({status:"success",message:"Contraseña restaurada"});
  }catch(error){
    return res.status(404).send({status: "error", error: error.message});
  }
}
 
}
