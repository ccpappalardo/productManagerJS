import mongoose from "mongoose" 
import { productsModel } from "../models/products.model.js"
import config from "../../../config.js";
export default class ProductDAO{
    
    connection=mongoose.connect(config.MONGO_URL);

     
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
    getProducts= async(limite=5, page=1,sort=0, filtro=null, filtroVal=null)=>{
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

    //funcion para saber si hay un producto en stock
    existeStock = async (producto,cantidad) => {
        try{
           // console.log(producto.stock>=cantidad)
            return producto.stock>=cantidad? true: false;
        }catch(e){
            console.log(e);
            return e;
        }
    }

    //funcion para saber si hay un producto en stock
    actualizarStock = async (element,cantidad) => {
        try{
            const nuevaCantidad=element.stock-cantidad;
            const filter = { _id: element._id };
            const update = { stock: nuevaCantidad };
            console.log(nuevaCantidad);
            console.log(filter);
            let result = await productsModel.findOneAndUpdate(filter, update);
        /*
            let result=await productsModel.updateOne(
                {_id: productoId},
                {$set: productoActualizado}
            );*/
            return result
            }catch(e){
                console.log(e);
                return e; 
            }
    }
  
   
} 