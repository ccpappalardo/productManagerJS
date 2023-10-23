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
     
     //Trae un ticket por id
     getTicketById = async (id) => {
        try{
            let result=await ticketsModel.findOne({_id: id});
            return result
            }catch(e){ 
                return e;
        }
    }

 
}
