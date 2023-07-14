import { Router } from "express";
import UserManager from "../../daos/mongodb/UserManager.class.js";
import { createHash, validatePassword } from "../../src/utils.js";
import passport from "passport";

const router = Router();

const managerUsers = new UserManager();

router.post("/register",
passport.authenticate("register", {failureRedirect: '/failregister'}),
(req, res) => {
    res.send({status:"success", message: "Usuario registrado"});
});

router.get("/failregister",async (req, res) => {
    console.log("Fallo la autenticación");
    res.send({error:"Fallo la autenticación"});
});
 
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


router.get("/faillogin",async (req, res) => {
  console.log("Fallo la autenticación del login");
  res.send({error:"Fallo la autenticación del login"});
});


router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.json({ status: 'Logout ERROR', body: err })
    }
    return res.send('Logout ok!')
    //res.redirect('/api/login')
  })
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
  passport.authenticate("github", { scope: "user:email" }),
  (req, res) => {}
);

//ruta callback que vuelve a github
//Si falla la autenticación en github, lo redirije al login
router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login'}),async (req, res)=>{
  console.log('Entro bien a githubCallback')
  req.session.user = req.user 
  res.redirect('/') 
} )

export default router