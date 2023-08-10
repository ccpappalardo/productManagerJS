import MessagesService from "../services/messages.service.js"


export default class MessagesController{

  constructor(){
    this.messagesService=new MessagesService()
  }


  async getMessagesController(){
    const messages = await this.messagesService.getMessagesService();
    return messages;
  } 


}