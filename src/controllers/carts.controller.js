
import CartService from "../services/carts.service.js"
import ProductService from "../services/products.service.js";

export default class CartController{

  constructor(){
    this.cartService=new CartService();
    this.productService=new ProductService();
  }

async createCartController(){
  const result=await this.cartService.createCartService();
  return result;
}

async getCartByIdController(id) {
  if (!id) {
    return {
      error: "debes especificar un id",
    };
  }
 
  const result = await this.cartService.getCartById(id);
  return result;
}

async getCartsController(){
  const carts = await this.cartService.getCartsService();
  return carts;
} 
async addProductInCartController(req,res){
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const productoBuscado= await this.productService.getProductByIdService(productId);
 
  if(req.user.role=="premium"){
    return res.status(403).
    send({status: "failure", message: "El rol premium no puede agregar productos al carrito"})
  }
  if (productoBuscado.owner === req.user.email) { 
    return res.status(403).
    send({status: "failure", message: "No está permitido que agregues este producto a este carrito"})
  }
  
 
  const carts = await this.cartService.addProductInCartService(cartId, productId);
  res.send({ status: "success" });
}

async deleteProductFromCartController(cartId,productId){
    const cart = await this.cartService.deleteProductFromCartService(cartId, productId);
    return cart
}

async deleteAllProductsFromCartController(cartId){

  const cart = await this.cartService.deleteAllProductsFromCartService(cartId); 
   return cart;
}

async updateProductFromCartController(req){
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  const cart = await this.cartService.updateProductFromCartService(cartId, productId,quantity);
  return cart
}

async updateAllProductsFromCartController(req){
  let cartId = req.params.cid
  let productos = req.body;
  const productoActualizado= await this.cartService.updateAllProductsFromCartService(cartId,productos);
  if(productoActualizado){
   return res.status(200).send({status: "success",result: productoActualizado, message: "El producto se ha actualizado con Éxito!"}); 
  }else{
    return res.status(403).
    send({status: "failure", message: "El producto no se ha actualizado!"})
  }
}

async procesarCompraController(req,res){
  let cartId = req.params.cid
  const compraProcesada= await this.cartService.procesarCompraService(cartId,req,res);
  return res.send({status: "success",result: compraProcesada});  
  }
}