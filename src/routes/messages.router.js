import { Router } from "express"; 
import MessagesController from "../controllers/messages.controller.js";

const router= Router();
const messagesController=new MessagesController() 
 
router.get("/", async(req,res)=>{
    let messages=await messagesController.getMessagesController();
 
    res.send(messages); 
  }); 

export default router;