import SessionService from "../services/session.service.js";
import { createHash, validatePassword} from "../../src/utils.js";
import jwt from 'jsonwebtoken' 
import config from "../config.js"; 
import Mail from "../helpers/mail.js";
import CartService from "../services/carts.service.js";

export default class SessionController{ 

  
  constructor(){
    this.sessionService=new SessionService()
    this.cartService=new CartService();
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
  //actualizo la ultima conexion del usuario
  await this.sessionService.updateUserLastConnection(req.user._id);
 } 

async loginFailController(req, res) { 
 res.status(400).send({status: "error", error: "Fallo la autenticación del login"})
}
 
async registerFailController(res) {
 
  res.status(400).send({status: "error", error: "Fallo la autenticación"})
}

async getCurrentController(req, res) {
    const result=await this.sessionService.getCurrentService(req, res);
    res.send(result);
}


async logoutController(res,req){
  //console.log(res);
    await this.sessionService.logoutService(req,res)
  //actualizo la ultima conexion del usuario--
  await this.sessionService.updateUserLastConnection(req.user._id);
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
 
 if(!email||!password) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
  const user = await this.sessionService.getUserByIdService(email);
 
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

//envia correo - email
  async requestResetPasswordController(req,res){
    const {email} = req.body;

    if(!email) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
    const user = await this.sessionService.getUserByIdService(email);
    if(!user) return res.status(404).send({status:"error",error:"El usuario no se encuentra registrado"});
    
    try{ 
      let tokenReset = jwt.sign({email}, config.TOKEN_RESET, {
        expiresIn: "1h",
      });

      
      let html = `<h1>Correo de Recuperación de Contraseña - ${email}</h1>`
      html = html.concat(
        `<div><h1>Restaura tu contraseña haciendo click en el siguiente link</h1> 
        https://productmanagerjs-production.up.railway.app/resetPassword?token=${tokenReset}</div>`);
     let asunto="Correo de Recuperación de Contraseña";
     const result=this.sessionService.enviarCorreo(email,asunto,html,res);
      return res.status(200).send({status: "success", result: result});
    }catch(error){
      return res.status(404).send({status: "error", error: error.message});
    }
  }

  async cambiarRolController(req,res){
    try {
      let id = req.params.uid
      let user = await this.sessionService.getUserService(id); 
      if(user.role=="user"){
        //Agrego control para saber si el usuario tiene los archivos necesarios para ser Premium
        const result=await this.sessionService.getPremiumRequiredDoc(id);
        if(result){
          await this.sessionService.updateUserRoleService(id, "premium");
          return res.status(200).send({status: "success", message: "Rol de Usuario actualizado a Premium"});
        }else{
          return res.status(400).
          send({status: "failure", message: "El usuario no tiene la documentación requerida para pasar a Premium."})

        }
      }else if(user.role=="premium"){
        await this.sessionService.updateUserRoleService(id, "user");
        return res.status(200).send({status: "success", message: "Rol de Premium actualizado a Usuario"});
      }else{
        return res.status(400).
        send({status: "failure", message: "No puede cambiar de Rol."})
      }
  
    }
    catch (error) {
      return res.status(404).send({status: "error", error: error.message});
    }
  }

//actualiza path de documentos
async updatePathDocuments(req,res){
  try {
     
    let id = req.params.uid;
    let archivos=req.files; 

    let identification;
    let adress;
    let accountStatus;

    if(archivos.identification){
     identification="/src/public/images/documents/identification/"+archivos.identification[0].filename;
    }
    if(archivos.adress){
     adress="/src/public/images/documents/adress/"+archivos.adress[0].filename;
    }
    if(archivos.accountStatus){
     accountStatus="/src/public/images/documents/accountStatus/"+archivos.accountStatus[0].filename;
    }

    const documentsPaths=[identification, adress, accountStatus]
    const documentsNames=["identification","adress","accountStatus"]
  
    let result = await this.sessionService.updatePathDocuments(id,documentsNames,documentsPaths);

    if(result){
      return res.send({status: "success", message: "Archivos actualizados con Exito!"});
    } 
    else{
      return res.status(400).
      send({status: "failure", details: "Error - No se pudo actualizar el path de archivos."})
    }

  }
  catch (error) {
    return res.status(404).send({status: "error", error: error.message});
  }
}

//Controlo si tiene la documentación requerida para ser Premium
async getPremiumRequiredDoc(req,res){
  try {
     
    let id = req.params.uid; 

    let result = await this.sessionService.getPremiumRequiredDoc(id);

    if(result){
      return res.send({status: "success", message: "tiene los archivos requeridos para ser Premium!"});
    } 
    else{
      return res.status(400).
      send({status: "failure", details: "Error - No tiene los archivos requeridos para ser Premium."})
    }

  }
  catch (error) {
    return res.status(404).send({status: "error", error: error.message});
  }
}

async getUsersController(req, res) {
  const result=await this.sessionService.getUsersService();
  res.status(200).send(result)
  
}

async deleteUsersInactivosController(req, res) {
  const usuarios=await this.sessionService.getUsersInactivos();
  try{
     
    let cuerpo = `<h1>Su usuario se encuentra inactivo</h1>`
    cuerpo = cuerpo.concat(
      `<div><h1>Se procede a eliminar su usuario del Sistema, ya que hemos detectado que no tiene actividad reciente.</h1> 
         Ante cualquier inquietud contáctenos! </div>`);

    if(usuarios.length==0) return res.status(404).send({status: "error", message: "No se encontraron usuarios inactivos!"});

    usuarios.forEach((user)=>{
       
      let asunto=`Usuario  - ${user.email}`;
      this.sessionService.enviarCorreo(user.email,asunto,cuerpo)
      this.sessionService.deleteUserInactivo(user);
      this.cartService.deleteCartService(user.cart);      
    })
    return res.status(200).send({status: "success", message: "Usuarios Eliminados con Exito!"});
  }catch(error){
    return res.status(404).send({status: "error", error: error.message});
  }

  
}


async deleteUserController(req, res) {  
    try{ 
      let id = req.params.uid;       
      let user = await this.sessionService.getUserService(id); 
      this.cartService.deleteCartService(user.cart);
      this.sessionService.deleteUser(id);
      
      res.status(200).send({status: "success", message: "Se ha eliminado el usuario con éxito"});
    }catch(error){
      return res.status(404).send({status: "error", error: error.message});
    }

  }
}