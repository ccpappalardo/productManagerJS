import { Router } from "express";
import { authorization, passportCall} from "../../src/utils.js"; 
import SessionController from "../controllers/session.controllers.js";
import passport from "passport";


let sessionController=new SessionController();

const router = Router(); 
  
router.post(
  "/register",
  passport.authenticate("register", { session: false, failureRedirect:'/failregister' }),
  async (req, res) => {
    res.send({ status: "success", message: "usuario  registrado" });
  }
);


router.get("/failregister",
async (req, res) => {
    const result=sessionController.registerFailController();
    res.send({result})
});


router.post("/login",
  passport.authenticate("login", { session: false, failureRedirect:'/faillogin'}),
  async (req, res) => {
    const result=await sessionController.loginController(req,res)    
    res.send({ status: "success", message: "usuario  logueado "+result });
  }
); 

router.get("/faillogin",async (req, res) => {
  await sessionController.loginFailController(req,res)   
});
 
//current
router.get("/current",passportCall("jwt"),authorization('user'),
async (req, res) => {
    await sessionController.getCurrentController(req,res);
}
);
 

router.post('/logout',
async (req, res) => {
    await sessionController.logoutController(res);
})


//ruta que llama a github
router.get("/github",
  passport.authenticate("github", { scope: "user:email", session:false }),
  async (req, res) => {
    await sessionController.githubController();
})

//ruta callback que vuelve a github 
router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login', session:false}),
async (req, res) => {
  await sessionController.githubcallbackController(req,res);
})


router.post('/restartPassword',
async (req, res) => {
    const result=await sessionController.resetPasswordController(req,res);
    res.send(result);
});
 

/*

//ruta callback que vuelve a github 
router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login', session:false}),
  sessionController.githubcallback
)
*/

export default router