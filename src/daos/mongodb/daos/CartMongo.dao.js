import mongoose from "mongoose";
import { cartModel } from "../models/carts.model.js";
import config from "../../../config.js";

export default class CartDAO { 
  
  connection=mongoose.connect(config.MONGO_URL);
 
  //Lee los carritos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
  getCarts = async () => {
    const result=await cartModel.find().populate('products.product');
     return result;
  };

  //funcion para agregar carritos al archivo
  async addCart(){
    const result= await cartModel.create({ products: []});
    return result;
  }
  async getCartById(id) {
    const cart = await cartModel.findOne({_id: id}).populate('products.product')
    //console.log(cart);
    return cart
  }
  
   //Recibe un id de carrito y lo devuelve en formato de objeto
   getAllProductsFromCart = async (carritoId) => {
    const result=await cartModel.findOne({
      _id: carritoId
     }).populate('products.product').lean();

     return result;
  };


  //Agrego a un carrito especifico un producto especifico
  addProductInCart = async (carritoId, product) => {
    
    const cart=await this.getCartById(carritoId);    
    
    let productoExiste=cart.products.find((prod) => prod.product._id.toString() === product._id.toString() ) 
    if(!productoExiste){
       cart.products.push({product: product, quantity: 1});
    }else{
       productoExiste.quantity += 1
    }
    await cart.save();
    return cart;
  };

   //Elimino un producto especifico de un carrito
   deleteProductFromCart = async (carritoId, productoId) => {
    const cart = await this.getCartById(carritoId)

    cart.products = cart.products.filter((prod) => prod.product._id.toString() !== productoId ) 
    await cart.save()
    return {
      status: 'success'
    } 
  };


  //Elimino todos los productos de un carrito en especifico
  deleteAllProductsFromCart = async (carritoId) => {
    const cart=await this.getCartById(carritoId);
    console.log(cart+"cart en dao")
    cart.products=[];
    await cart.save();
    return cart;
  };

  //Actualizo producto por el id, propiedad y valor que le seteo
  updateProduct = async (carritoId,productoId,quantity) => {
   try{
      const cart=await this.getCartById(carritoId);
      let product = cart.products.find((prod) => prod.product._id.toString() === productoId )
      product.quantity=quantity;
      await cart.save();
      return result
    }catch(e){
        console.log(e);
        return e; 
    }
}
 

updateAllProductsFromCart = async (carritoId,arrayProductos) => {
  try{
    const cart=await this.getCartById(carritoId);
    cart.products=arrayProductos;
    await cart.save();
    }catch(e){
        console.log(e);
        return e; 
    }
}

 
}
