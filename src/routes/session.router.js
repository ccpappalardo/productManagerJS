import { Router } from "express";
import UserManager from "../../daos/mongodb/UserManager.class.js";
import { authorization, createHash, passportCall} from "../../src/utils.js";
import passport from "passport";
import jwt from 'jsonwebtoken'

const router = Router();

const managerUsers = new UserManager();


router.post("/register",
passport.authenticate("register", { session: false, failureRedirect:'/failregister'}),
(req, res) => {
    res.send({status:"success", message: "Usuario registrado"});
});

router.get("/failregister",async (req, res) => {
    console.log("Fallo la autenticación");
    res.send({error:"Fallo la autenticación"});
});


/*
router.post("/login", passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req, res) => {
  if (!req.user) return res.status(400).send({status:"error", message:"Invalid credentials"})
  req.session.user = {
      name: req.user.name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role
  };
  return res.send({ status: "success", payload:req.user });
});
*/

router.post(
  "/login",
  passport.authenticate("login", { session: false, failureRedirect:'/faillogin'}),
  async (req, res) => {

    //Seteo el token
  const usuario={
    nombre: `${req.user.first_name} - ${req.user.last_name}`,
    email: req.user.email,
    edad: req.user.age,
    rol: req.user.role,
    id: req.user._id
    }


    let token = jwt.sign({ email: req.body.email, usuario, role:'user'}, "coderSecret", {
      expiresIn: "24h",
    });
    res
      .cookie("coderCookie", token, { httpOnly: true })
      .send({ status: "success", user: req.user });
  }
);


router.get("/faillogin",async (req, res) => {
  console.log("Fallo la autenticación del login");
  res.send({error:"Fallo la autenticación del login"});
});

//current
router.get(
  "/current",
  passportCall("jwt"),authorization('user'),
  (req, res) => {
    res.send(req.user);
  }
);

router.post('/logout', (req, res) => {
  //eliminar la cookie
  console.log("Cookie eliminada");
  res.clearCookie('coderCookie').send('Cookie Eliminada');
 })

router.post('/restartPassword',async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"No completo los campos del Formulario"});
  const user = await managerUsers.getUserById(email);
  if(!user) return res.status(404).send({status:"error",error:"El usuario no se encuentra registrado"});
  const newHashedPassword = createHash(password);
  await managerUsers.updatePassword(user._id,newHashedPassword);
  res.send({status:"success",message:"Contraseña restaurada"});
})

//ruta que llama a github
router.get("/github",
  passport.authenticate("github", { scope: "user:email", session:false }),
  (req, res) => {}
);

//ruta callback que vuelve a github 
router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login', session:false}),async (req, res)=>{
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
} )

export default router