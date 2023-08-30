import mongoose from "mongoose" 
import { userModel } from "../models/users.model.js";
import config from "../../../config.js";

export default class UserDAO{
    
    connection=mongoose.connect(config.MONGO_URL);

        //funcion para agregar user 
    addUser= async (user) => {
        try{
        let result=await userModel.create(user);
        return result
        }catch(e){ 
            return e;
        }
    }
   
       
   //Recibe un email y lo devuelve en formato de objeto
    getUserById = async (email) => {
        try{
        //let result= await userModel.findOne({email: email}).populate('carts.cart');
        let result= await userModel.findOne({email: email});
        return result
        }catch(e){ 
            return e; 
        }
    }

    //Recibe un id de user y lo devuelve en formato de objeto
    getUser = async (id) => {
        try{
        //let result= await userModel.findOne({_id: id}).populate('carts.cart');
        let result= await userModel.findOne({_id: id});
        return result
        }catch(e){ 
            return e; 
        }
    }
 

      //Recibe un id de user y lo devuelve en formato de objeto
      getUserByEmailPass = async (email,password) => {
        try{
        //let result=await userModel.findOne({email: email, password:password}).populate('carts.cart');
        let result=await userModel.findOne({email: email, password:password});
        return result
        }catch(e){ 
            return e; 
        }
    }

    updatePassword = async (user,password) => {
        try{
            let result=await userModel.updateOne(
                {_id: user},
                {$set: {password:password}}
            );
          
            return result
            }catch(e){ 
                return e; 
            }
    }
 
   
} 