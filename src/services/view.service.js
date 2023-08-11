import ProductService from "./products.service.js";
import CartService from "./carts.service.js";
import MessagesService from "./messages.service.js";

export default class ViewsService {
    constructor(){
        this.productsService = new ProductService();
        this.cartService=new CartService();
        this.messageService=new MessagesService();
    }

    async getProductService(query,limit){
        const result = await this.productsService.getProductService(query,limit)
        return result;
    }
    
    async getProductsPaginadosService(limite,page){
        const result = await this.productsService.getProductsPaginadosService(limite,page)
        return result;
    }
   
    async getProductByIdService(id){
        const result = await this.productsService.getProductByIdService(id)
        return result;
    }
    
    async getAllProductsFromCartService(cartId){
        const result = await this.cartService.getAllProductsFromCartService(cartId);
        return result;
    } 

    
    async getMessageService(){
        const result = await this.messageService.getMessageService();
        return result;
    }

    

}

