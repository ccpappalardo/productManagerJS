import { Router } from "express"; 
import messagesController from "../controllers/messages.controller.js";

const router= Router();

router.get('/', messagesController.getMessages)

export default router;