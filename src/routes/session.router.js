import { Router } from "express";
import { authorization, passportCall} from "../../src/utils.js"; 
import sessionController from "../controllers/session.controllers.js";
import passport from "passport";


const router = Router(); 
 
router.post("/register",
passport.authenticate("register", { session: false, failureRedirect:'/failregister'}),
sessionController.register);

router.get("/failregister",sessionController.registerFail);

router.post("/login",
  passport.authenticate("login", { session: false, failureRedirect:'/faillogin'}),
  sessionController.login
  ); 

router.get("/faillogin",async (req, res) => {
  console.log("Fallo la autenticación del login");
  res.send({error:"Fallo la autenticación del login"});
});

//current
router.get("/current",passportCall("jwt"),authorization('user'),
 sessionController.getCurrent
);

router.post('/logout', sessionController.logout)

router.post('/restartPassword',sessionController.resetPassword)
//ruta que llama a github
router.get("/github",
  passport.authenticate("github", { scope: "user:email", session:false }),
  sessionController.github
);
//ruta callback que vuelve a github 
router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login', session:false}),
  sessionController.githubcallback
)

export default router