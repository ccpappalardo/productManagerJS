import MessagesService from "../services/messages.service.js"


export default class MessagesController{

  constructor(){
    this.messagesService=new MessagesService()
  }

  async getMessagesController(){
    const messages = await this.messagesService.getMessagesService();
    return messages;
  } 

async addMessageController(req, res){
  let nuevoMensaje = req.body.message
  let user = req.body.user
  this.messagesService.addMessageService(user,nuevoMensaje);
  req.socketServer.emit("update-messages", await  this.messagesService.getMessagesService())
  res.send({status: "success"})
}

}