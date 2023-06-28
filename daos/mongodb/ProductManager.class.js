import mongoose from "mongoose" 
import { productsModel } from "./models/products.model.js"
export default class ProductManager{
    
    connection=mongoose.connect('mongodb+srv://ccpappalardo:xSI4tapwfkxSAbeC@cluster0.gcl8y5w.mongodb.net/ecommerce?retryWrites=true&w=majority');

     
    //funcion para agregar productos al archivo
    addProduct = async (product) => {
        try{
        let result=await productsModel.create(product);
        return result
        }catch(e){
            console.log(e);
            return e;
        }
    }
   
    //Lee los productos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
    getProducts= async(limite=10, page=1,sort=0, filtro=null, filtroVal=null)=>{
        try{
 
        let whereOptions={};

        if(filtro!="" && filtroVal!=""){
            whereOptions= {[filtro]: filtroVal};
        }
        let result=await productsModel.paginate(
            whereOptions,
            {limit: limite,page:page,sort:{price: sort}}
        );

        return result
        }catch(e){
            console.log(e);
            return e;
        }
    } 

    
    //Lee los productos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
    getProductsPaginados= async(limite=10, page=1,sort=0, filtro=null, filtroVal=null)=>{
        try{
        let whereOptions={};
        
        if(filtro!="" && filtroVal!=""){
            whereOptions= {[filtro]: filtroVal};
        }
        let result=await productsModel.paginate(
            whereOptions,
            {limit: limite,page:page,sort:{price: sort, _id:-1}, lean:true}
        );

        return result
        }catch(e){
            console.log(e);
            return e;
        }
    } 
 

    
   //Recibe un id de producto y lo devuelve en formato de objeto
    getProductById = async (productoId) => {
        try{
        let result=await productsModel.findOne({_id: productoId});
        return result
        }catch(e){
            console.log(e);
            return e; 
        }
    }

   //Actualizo producto por el id, propiedad y valor que le seteo
    updateProduct = async (productoId,productoActualizado) => {
        try{
        let result=await productsModel.updateOne(
            {_id: productoId},
            {$set: productoActualizado}
        );
        return result
        }catch(e){
            console.log(e);
            return e; 
        }
    }
   
   //Metodo que elimina producto del array por Id pasado por parámetro
   deleteProduct= async (productoId) => { 
   
    try{
    let result=await productsModel.deleteOne({_id: productoId});
    return result;
    }catch(e){
            console.log(e);
            return e; 
        }
    }
  
   
} 