import mongoose from "mongoose" 
import { userModel } from "../models/users.model.js";
import config from "../../../config.js";

export default class UserDAO{
    
    connection=mongoose.connect(config.MONGO_URL);
    
        //funcion para agregar user 
    addUser= async (user) => {
        try{
 
        //Comprobante de domicilio, Comprobante de estado de cuenta
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

    updateRole=async(id,role)=>{
        try{
            let result=await userModel.updateOne(
                {_id: id},
                {$set: {role:role}}
            );
        return result;
        }catch(e){
            return e;
        }
    }

    updateLastConnection=async(id)=>{
        try{
            let ahora=Date.now();
            let result=await userModel.updateOne(
                {_id: id},
                {$set: {last_connection:ahora}}
            );
        return result;
        }catch(e){
            return e;
        }
    }

    updatePathDocuments=async(id,documentsNames,documentsPaths)=>{
        try{
            let user= await userModel.findOne({_id: id});
           

            for(let i=0; i<documentsPaths.length; i++){
                const path=documentsPaths[i]
                const name=documentsNames[i]
 
                if(path!=undefined){
                    const existeDocumento=user.documents.find(doc=>doc.name==name);
                    if(existeDocumento){
                        existeDocumento.reference=path;
                    }else{
                        user.documents.push({
                            name:name,
                            reference: path
                        });
                    }

                }
            }
            /*
            if(archivos.adress){
                user.documents.push({
                    name:'profiles',
                    reference: "/src/public/images/profiles/"+archivos.profiles[0].filename
                });
            }
            if(archivos.products){
                user.documents.push({
                    name:'products',
                    reference: "/src/public/images/products/"+archivos.products[0].filename
                }); 
            }
            */          
            const result= await user.save();
            return result; 
        }catch(e){
            return e;
        }
    }

     //Recibe un id de user y lo devuelve en formato de objeto
     getPremiumRequiredDoc = async (id) => {
        try{
        let user= await userModel.findOne({_id: id});
  
        let identification, adress,accountStatus;
        if(!user.documents) return false;        
        for(let i=0; i<user.documents.length;i++){
            identification=user.documents.find(doc=>doc.name=='identification' && doc.reference!="");
            adress=user.documents.find(doc=>doc.name=='adress' && doc.reference!="");
            accountStatus=user.documents.find(doc=>doc.name=='accountStatus' && doc.reference!="");   
        }
 
        return identification && adress && accountStatus? true: false; 
        }catch(e){ 
            return e; 
        }
    }

    //Devuelve todos los usuarios del Sistema
    getUsers = async () => {
        try{
        let result= await userModel.find();
        return result
        }catch(e){ 
            return e; 
        }
    }


    getUsersInactivos= async()=>{
        try{
        let ahora=Date.now() - 2*24*60*60*1000;       
        const result = await userModel.find({ 
            last_connection: {
                $lt: ahora
            }
        })
       
        return result
        }catch(e){
            return e;
        }
    }  

    //Metodo que elimina el usuario por el id
    deleteUserById= async (id) => { 
   
        try{
        let result=await userModel.deleteOne({_id: id});
        return result;
        }catch(e){ 
                return e; 
            }
        }
 
} 