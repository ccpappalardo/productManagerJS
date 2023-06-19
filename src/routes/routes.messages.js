import { Router } from "express";
//import ManagerCarts from '../classes/CartManager.class.js'
import ManagerMessages from "../../daos/mongodb/MessagesManager.class.js";

const router= Router();

const managerMessages = new ManagerMessages();

 
router.get('/', async (req,res)=>{     
    const messages = await managerMessages.getMessages();
    res.send(messages);
})

 
 
export default router;