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
 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  let user
 // console.log(email!='adminCoder@coder.com')
    if(email!='adminCoder@coder.com')
    { user = await managerUsers.getUserById(email); 
      if (!user) return res.redirect('/api/login')
      if(!validatePassword(password, user)) return res.redirect('api/login')
      
      req.session.user = {
        name: user.first_name + user.last_name,
        email: user.email,
        age: user.age,
        rol: "user"
      };
    }else{
        req.session.user = {
        name: "Admin Coder",
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
        rol: "admin"
      };
      
    }
    res.send({ status: "success", message: req.session.user });
  
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