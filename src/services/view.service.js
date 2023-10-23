import ProductService from "./products.service.js";
import CartService from "./carts.service.js";
import MessagesService from "./messages.service.js";
import SessionService from "./session.service.js";
import TicketService from "./tickets.service.js";

export default class ViewsService {
    constructor(){
        this.productsService = new ProductService();
        this.cartService=new CartService();
        this.messageService=new MessagesService();
        this.sessionService=new SessionService(); 
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

    
    async getMessagesService(){ 
        const result = await this.messageService.getMessagesService();
        return result;
    }

    
    async getUsersService(){
        let result = await this.sessionService.getUsersService();
        return result;
    }

    async getTicketService(id){
        let result=await  this.cartService.getTicketService(id);
        return result;
    }

    

}

