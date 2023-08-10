import ViewsService from "../services/view.service.js";

export default class ViewController{ 

  constructor(){ 
    this.viewService=new ViewsService();
  }

 
async getHome(req, res){
  //const productos= await productosManager.getProducts(req.query.limit);
  res.render('profile', {
      user: req.user
  });
}


async getProductsPaginadosController(req,res){
  let user=req.user;
  let page = req.query.page;
  let limite=req.query.limit;
  let products = await this.viewService.getProductsPaginadosService(limite,page);
  //let products = await this.productsService.getProductsPaginadosService(limite,page);
  //limite=5; //Se lo seteo porque tengo pocos productos

  products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}&limit=${products.limit}`:'';
  products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}&limit=${products.limit}`:'';

  res.render('home', {
    title: "productos",
    products: products,
    user: user
  });
}
 

async getProductByIdController(id){  
  let result = await this.viewService.getProductByIdService(id)
  //let result = await this.productsService.getProductByIdService(id)
  //res.render('product',result) 
  return result;
}
 

async getCart(req,res){ 
    const id = req.params.id;
  try{
    const cart = await this.viewService.getAllProductsFromCartService(id)
    //const cart = await this.cartService.getAllProductsFromCartService(id)
    //managerCart.getAllProductsFromCart(id);
    res.render('cart',cart) 
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
}

async getRealTimeProducts(req, res) {
    const productos= await this.viewService.getProductService(req.query,limit);
    //productosManager.getProducts(req.query.limit);
      res.render('realTimeProducts', { products: productos, style: "style.css", title: "Productos" })
  }
 

async getChat(req, res){
    const messages= await this.viewService.getMessageService();
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
/*
export default {
    getHome,
    getProducts,
    getProduct,
    getCart,
    getRealTimeProducts,
    getChat,
    getRegister,
    getLogin,
    getCurrent,
    getProfile,
    resetPassword
}
*/
}