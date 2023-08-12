import MessageDAO from "../daos/mongodb/daos/MessagesManager.dao.js" 

export default class MessagesService {

    constructor(){
        this.messageDao= new MessageDAO(); 
    }

    async getMessagesService(){
        const result =await this.messageDao.getMessages();
        return result;
    }
 
    async addMessageService(user, message){
        
        await this.messageDao.create(user, message)
    }


}