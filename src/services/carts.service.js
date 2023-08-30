import CartDAO from "../daos/mongodb/daos/CartMongo.dao.js"
import ProductService from "./products.service.js";
import SessionService from "./session.service.js";
import TicketService from "./tickets.service.js";
import { v4 as uuidV4 } from "uuid";


export default class CartService {

    constructor(){
        this.cartDao= new CartDAO();
        this.productService=new ProductService;
        this.sessionService=new SessionService;
        this.ticketService=new TicketService;
    }

    async createCartService(){
      
        const result =await this.cartDao.addCart();
        return result;
    }
 
  async getCartById(id) {
   // console.log(id)
    const result = await this.cartDao.getCartById(id);
    if (!result) {
      return { error: "carrito no encontrado" };
    }
    return result;
  }

  async getCartsService(){
    const result = await this.cartDao.getCarts();

    if (!result) {
      return { error: "No hay carritos" };
    }
    return result;
  }

  
  async addProductInCartService(cartId,productId){
    const product=await this.productService.getProductByIdService(productId);
    const result = await this.cartDao.addProductInCart(cartId,product);
    if (!result) {
      return { error: "No hay carritos" };
    }
    return result;
  }


  async deleteProductFromCartService(cartId,productId){
    const result = await this.cartDao.deleteProductFromCart(cartId,productId);
    if (!result) {
      return { error: "Error" };
    }
    return result;
  }

  
  async deleteAllProductsFromCartService(cartId){
    const result = await this.cartDao.deleteAllProductsFromCart(cartId);
    if (!result) {
      return { error: "Error" };
    }
    return result;
  }

  
  async updateProductFromCartService(cartId, productId,quantity){
    const result = await this.cartDao.updateProduct(cartId,productId,quantity);
    if (!result) {
      return { error: "Error" };
    }
    return result;
  }

  
  async updateAllProductsFromCartService(cartId, products){
    
    const result = await this.cartDao.updateAllProductsFromCart(cartId,products);
    if (!result) {
      return { error: "Error" };
    }
    return result;
  }

  async getAllProductsFromCartService(id){
    const result = await this.cartDao.getAllProductsFromCart(id);
    if (!result) {
      return { error: "Error" };
    }
    return result;
  }
   
  async procesarCompraService(cartId,req,res) {
    const result = await this.cartDao.getCartById(cartId);
  
    let productosEnStock = [];
    let productosSinStock = [];

    //Recorro el array de productos que tiene el carrito-
    let precioTotal=0;
    if(result.products==[]){
      let resultado="No hay productos en el carrito";
      return resultado;
    }

    for (let element of result.products) {
      let tieneStock = await this.productService.getProductTieneStockService(
        element.product,
        element.quantity
      );
 
 
      if (tieneStock) {
        await this.productService.getActualizarStockService(
          element.product,
          element.quantity
        );
        productosEnStock.push(element._id); 
        precioTotal=precioTotal+(element.quantity*element.product.price);
      
      } else {
 
        productosSinStock.push(element.product._id);
       
      }
    } 

    //Si se compraron productos, imprimo el ticket
    if(productosEnStock!=[]){

        let usuario=req.user.email
        let ticketCompra={
          purchase_datetime: new Date().toString(),
          amount:precioTotal,
          purchaser:usuario,
          code: uuidV4(),
          products: productosEnStock
        }
  
        let ticket=await this.ticketService.getCreateTicketService(ticketCompra)
    
        let tickets= {
        ticket,
        productosSinStock
        }
      
        res.send({
          status: "success",
          payload: tickets,
        });
        }else{ //Si no se compraron productos xq no habia stock imprimo el array de productos sin stock-
            return productosSinStock;
        }
      

    }

}