import UserManager from "../daos/mongodb/managers/UserManager.class.js";
import { createHash} from "../../src/utils.js";
import config from "../config.js";
import jwt from 'jsonwebtoken' 


const managerUsers = new UserManager();

const register= async (req, res) => {
    res.send({status:"success", message: "Usuario registrado"});
}

const registerFail=async (req, res) => {
    console.log("Fallo la autenticación");
    res.status(400).send({status: "error", error: "Fallo la autenticación"})
}

const login= async (req, res) => {
   //Seteo el token
  const usuario={
    nombre: `${req.user.first_name} - ${req.user.last_name}`,
    email: req.user.email,
    edad: req.user.age,
    rol: req.user.role,
    id: req.user._id
    }

    let token = jwt.sign({ email: req.body.email, usuario, role:'user'}, config.JWT_SECRET, {
      expiresIn: "24h",
    });
    res
      .cookie("coderCookie", token, { httpOnly: true })
      .send({ status: "success", user: req.user });
  }

const loginFail= async (req, res) => {
  console.log("Fallo la autenticación del login");
  res.status(400).send({status: "error", error: "Fallo la autenticación del login"})
}

const getCurrent=(req, res) => {
    res.send(req.user);
  }

const logout=(req, res) => {
  //eliminar la cookie
  console.log("Cookie eliminada");
  res.clearCookie('coderCookie').send('Cookie Eliminada');
 }

const resetPassword=async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
  const user = await managerUsers.getUserById(email);
  if(!user) return res.status(404).send({status:"error",error:"El usuario no se encuentra registrado"});
  
  try{
    const newHashedPassword = createHash(password);
    await managerUsers.updatePassword(user._id,newHashedPassword);
    res.send({status:"success",message:"Contraseña restaurada"});
  }catch(error){
    return res.status(404).send({status: "error", error: error.message});
  }
}

//llama a github
const github=(req, res) => {}

//ruta callback que vuelve a github 
const githubcallback=async (req, res)=>{
  //Seteo el token
  const usuario={
    nombre: `${req.user.first_name} - ${req.user.last_name}`,
    email: req.user.email,
    edad: req.user.age,
    rol: req.user.role,
    id: req.user._id
    }
  
   let token = jwt.sign({ email: req.user.email, usuario, role:'user'}, "coderSecret", {
        expiresIn: "24h",
    });
    console.log('Entro bien a githubCallback')
    //redirecciono a products si se loguea correctamente
    return res.cookie("coderCookie", token, { httpOnly: true }).redirect('/products') 
}

export default {
  register,
  registerFail,
  login,
  loginFail,
  getCurrent,
  logout,
  resetPassword,
  github,
  githubcallback
}