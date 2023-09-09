import mongoose from "mongoose";
import { messagesModel } from "../models/messages.model.js";
import config from "../../../config.js";

export default class MessagesDAO {

  
  connection=mongoose.connect(config.MONGO_URL);
  
  //Lee los carritos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
  getMessages = async () => {
    const result=await messagesModel.find();
     return result;
  };

  create = async (user,message) => {
    const result= await messagesModel.create({ user: user, message: message});
    return result;
  };
 
 
   //Recibe un id de mensaje y lo devuelve en formato de objeto
  getMessageById = async (id) => {
    const result=await messagesModel.findOne({
      _id: id
     });

     return result;
  };

 
}
