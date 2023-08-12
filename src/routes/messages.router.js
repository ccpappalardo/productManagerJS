import { Router } from "express"; 
import { passportCall } from "../utils.js";
import { userAuth } from "./middlewares/roles.middleware.js";
import MessagesController from "../controllers/messages.controller.js";

const router= Router();
const messagesController=new MessagesController() 
 
router.get("/", async(req,res)=>{
    let messages=await messagesController.getMessagesController();
 
    res.send(messages); 
  }); 
 
  router.post("/", passportCall("jwt"),userAuth, async(req,res)=>{
     let messages=messagesController.addMessageController(req,res)
  }) 

export default router;