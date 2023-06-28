import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductManager.class.js";

export default class ManagerCarts {

  
  connection=mongoose.connect('mongodb+srv://ccpappalardo:xSI4tapwfkxSAbeC@cluster0.gcl8y5w.mongodb.net/ecommerce?retryWrites=true&w=majority');
  productManager=new ProductManager();
  //Lee los carritos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
  getCarts = async () => {
    const result=await cartModel.find().populate('products.product');
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

  
   //Recibe un id de carrito y lo devuelve en formato de objeto
   getAllProductsFromCart = async (carritoId) => {
    const result=await cartModel.findOne({
      _id: carritoId
     }).populate('products.product').lean();

     return result;
  };


  //Agrego a un carrito especifico un producto especifico
  addProductInCart = async (carritoId, productoId) => {
    const product=await this.productManager.getProductById(productoId);
    const cart=await this.getCartById(carritoId);
    
    //const quantity -- ver de sumar si ya existe el producto
    cart.products.push({product: product, quantity: 1});
    await cart.save();
    return;
    
  };

   //Elimino un producto especifico de un carrito
   deleteProductFromCart = async (carritoId, productoId) => {
    const cart=await this.getCartById(carritoId);
    cart.products.pull(productoId);
    await cart.save();
    return;
  };


  //Elimino todos los productos de un carrito en especifico
  deleteAllProductsFromCart = async (carritoId) => {
    const cart=await this.getCartById(carritoId);
    cart.products=[];
    await cart.save();
    return;
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
    /*
    await Test.updateMany({ _id: carritoId }, { $set: { products: arrayProductos } });
    let result=await product.updateMany(
        {$set: arrayProductos}
    );
    return result */
    }catch(e){
        console.log(e);
        return e; 
    }
}

 
}
