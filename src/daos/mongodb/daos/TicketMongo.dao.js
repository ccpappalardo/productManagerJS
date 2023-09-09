import mongoose from "mongoose";
import { ticketsModel } from "../models/tickets.model.js";
import config from "../../../config.js";

export default class TicketDAO {
  
    connection=mongoose.connect(config.MONGO_URL);
    
    //crea un ticket nuevo
    createTicket = async (ticket) => {
        try{
            let result=await ticketsModel.create(ticket);
            return result
            }catch(e){ 
                return e;
        }
    }
    
    //trae todos los tickets de un email.
    imprimirTicketByUser = async (username) => {
        try{
            let result=await ticketsModel.findOne({purchaser: username});
            return result
            }catch(e){ 
                return e; 
            }
    }

 
}
