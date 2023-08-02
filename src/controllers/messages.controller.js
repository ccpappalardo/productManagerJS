import ManagerMessages from "../daos/mongodb/managers/MessagesManager.class.js";

const managerMessages = new ManagerMessages();

const getMessages = async(req,res)=>{
    const messages = await managerMessages.getMessages();
    res.send(messages);
  }

  export default {
    getMessages,
  }