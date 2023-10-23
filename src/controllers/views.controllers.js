import TicketDAO from "../daos/mongodb/daos/TicketMongo.dao.js";
import TicketService from "../services/tickets.service.js";
import ViewsService from "../services/view.service.js";
import { getMockProduct } from "../utils.js";
import ticketDTO from "./dtos/ticket.dto.js";

export default class ViewController{ 

  constructor(){ 
    this.viewService=new ViewsService(); 
  }

 
async getHomeController(req, res){
  res.render('profile', {
      user: req.user
  });
}

async getProductsController(req, res, limite){
  let user=req.user;
  const productos= await this.viewService.getProductService(limite);
  res.render('home', {
    title: "productos",
    products: productos,
    user: user
  });
}


async getProductsPaginadosController(req,res){
  let user=req.user;
  let page = req.query.page;
  let limite=req.query.limit;
  let products = await this.viewService.getProductsPaginadosService(limite,page); 

  products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}&limit=${products.limit}`:'';
  products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}&limit=${products.limit}`:'';
  return products;

}
 

async getProductByIdController(id){  
  let result = await this.viewService.getProductByIdService(id)
  return result;
}
 

async getAllProductsFromCartController(id){ 
  try{
      const cart = await this.viewService.getAllProductsFromCartService(id) 
      return cart;
  }catch (error) {
      console.error(error);
      res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
}

async getRealTimeProducts(req, res) {
    const productos= await this.viewService.getProductService(req.query,limit);
      res.render('realTimeProducts', { products: productos, style: "style.css", title: "Productos" })
  }
 

async getChatController(req, res){
    const messages= await this.viewService.getMessagesService();
 
      res.render('chat', { messages: messages, style: "style.css", title: "Mensajes" })
  }

  async getRegister(req, res){
    res.render('register');
}

async getLogin(req, res){
    res.render('login');
}

async getCurrent(req, res){
  res.redirect('/api/sessions/current')
}
 
async getProfile(req, res){
    res.render('profile', {
        user: req.user
    });
}

async resetPassword(req,res){
  res.render('resetPassword');
}  
 
async requestResetPassword(req,res){
 
  res.render('requestResetPassword');
}  


async generateMockProductsController(req){
  let productos=[];
  for (let i = 0; i < 100; i++) {
    productos.push(await getMockProduct());
  } 
  return productos; 
  };

  
   async getUsersController(req,res){
      let usuarios = await this.viewService.getUsersService(); 
       
       res.render('admin', {
           user: req.user,
           users: usuarios
       });
    };
 
    
  async getTicket(id,res,req){  
  try{
 
 
    let ticket= await this.viewService.getTicketService(id);
    
    let ticketFormateado=new ticketDTO(ticket)
 
    res.render('ticket', {
      user: req.user,
      ticket: ticketFormateado
  }); 

  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
  }
}