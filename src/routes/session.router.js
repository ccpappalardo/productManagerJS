import { Router } from "express";
import { authorization, passportCall} from "../../src/utils.js"; 
import SessionController from "../controllers/session.controllers.js";
import passport from "passport";
import CustomError from "../services/error/customerror.class.js";
import { ErrorEnum } from "../services/enum/error.enum.js";

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
 

// TO DO - Sacar luego porque está para hacer pruebas
router.get('/:id',
async (req, res) => {
    
   let  id=req.params.id;
    console.log(id);
    if (isNaN(id)){
      CustomError.createError({
          name: 'id is not a number',
          cause: `the given id ${id} is not a number`,
          message: 'cannot get users',
          code: ErrorEnum.PARAM_ERROR
      })
    }
    
});
 


export default router