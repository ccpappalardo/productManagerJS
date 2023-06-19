import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";

export default class ManagerCarts {

  
  connection=mongoose.connect('mongodb+srv://ccpappalardo:xSI4tapwfkxSAbeC@cluster0.gcl8y5w.mongodb.net/ecommerce?retryWrites=true&w=majority');
  productManager=new ProductManager();
  //Lee los carritos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
  getCarts = async () => {
    const result=await cartModel.find();
     return result;
  };

  //funcion para agregar carritos al archivo
  addCart = async () => {
    const result= await cartModel.create({ products: []});
    return result;
  };

  
   //Recibe un id de carrito y lo devuelve en formato de objeto
  getCartById = async (carritoId) => {
    const result=await cartModel.findOne({
      _id: carritoId
     }).populate('products.product');

     return result;
  };


  //Agrego a un carrito especifico un producto especifico
  addProductInCart = async (carritoId, productoId) => {
    const product=await this.productManager.getProductById(productoId);
    const cart=await this.getCartById(carritoId);
    
    cart.products.push({product: product});
    await cart.save();
    return;
  };
 
}
