import { Router } from "express";
import { authorization, passportCall} from "../../src/utils.js"; 
import SessionController from "../controllers/session.controllers.js";
import passport from "passport"; 
import { ErrorEnum } from "../services/enum/error.enum.js";
import CustomError from "../services/Error/CustomError.class.js";
import { generateErrorInfo } from "../services/info.js";

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
   await sessionController.loginController(req,res)    
   //res.send({ status: "success", message: "usuario  logueado " });
  }
); 

router.get("/faillogin",async (req, res) => {
  await sessionController.loginFailController(req,res)   
});
 
//current
//router.get("/current",passportCall("jwt"),authorization('user'),
router.get("/current",passportCall("jwt"),
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



router.post('/requestResetPassword',
    async(req,res)=>{
    const result=await sessionController.requestResetPasswordController(req,res);
});

router.get('/loggerTest', async (req, res) => {

  req.logger.fatal("Logger - level 'fatal'")
  req.logger.error("Logger - level 'error'")
  req.logger.warning("Logger - level 'warning'")
  req.logger.info("Logger - level 'info'")
  req.logger.http("Logger - level  'http'")
  req.logger.debug("Logger - level 'debug'")

  res.send("Se termino de probar el logger exitosamente")
});

// upgrade user to premium, degrade premium to user 

router.post(
  '/premium/:uid',
  passportCall("jwt",{ session: false }),
  async(req,res)=>{
  sessionController.cambiarRolController(req,res);
})

export default router