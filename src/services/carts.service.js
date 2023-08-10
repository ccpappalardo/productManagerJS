import CartDAO from "../daos/mongodb/daos/CartMongo.dao.js"
import ProductService from "./products.service.js";


export default class CartService {

    constructor(){
        this.cartDao= new CartDAO();
        this.productService=new ProductService;
    }

    async createCartService(){
      
        const result =await this.cartDao.addCart();
        return result;
    }
 
  async getCartById(id) {
    console.log(id)
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
  

}