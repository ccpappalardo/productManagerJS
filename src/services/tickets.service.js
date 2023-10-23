import TicketDAO from "../daos/mongodb/daos/TicketMongo.dao.js";

export default class TicketService {

    constructor(){
        this.ticketDao= new TicketDAO(); 
    }
 
  
    async getCreateTicketService(ticket){
        const result=await this.ticketDao.createTicket(ticket);
        return result;
    }

      
    async getTicketService(id){
        const result = await this.ticketDao.getTicketById(id);
        return result;
    }
  
  

}