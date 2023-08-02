 import ProductManager from "../daos/mongodb/managers/ProductManager.class.js";
import ManagerCarts from "../daos/mongodb/managers/CartManager.class.js";
import MessagesManager from "../daos/mongodb/managers/MessagesManager.class.js" 

  
const productosManager=new ProductManager()
const messageManager=new MessagesManager()
const managerCart = new ManagerCarts();
 
const getHome=async (req, res) => {
  //const productos= await productosManager.getProducts(req.query.limit);
  res.render('profile', {
      user: req.user
  });
}


const getProducts=async (req,res)=>{
  let user=req.user;
  let page = req.query.page;
  let limite=req.query.limit;
  let products = await productosManager.getProductsPaginados(limite,page);
  //limite=5; //Se lo seteo porque tengo pocos productos
  products.prevLink = products.hasPrevPage?`http://localhost:8080/products?page=${products.prevPage}&limit=${products.limit}`:'';
  products.nextLink = products.hasNextPage?`http://localhost:8080/products?page=${products.nextPage}&limit=${products.limit}`:'';

  res.render('home', {
    title: "productos",
    products: products,
    user: user
  });
}
 
const getProduct=async (req,res)=>{ 
  const id = req.params.id;
  let result = await productosManager.getProductById(id)
  res.render('product',result) 
}
 
const getCart=async (req,res)=>{ 
    const id = req.params.id;
  try{
    const cart = await managerCart.getAllProductsFromCart(id);
    res.render('cart',cart) 
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
}

const getRealTimeProducts=async (req, res) => {
    const productos= await productosManager.getProducts(req.query.limit);
      res.render('realTimeProducts', { products: productos, style: "style.css", title: "Productos" })
  }
 

const getChat=async (req, res) => {
    const messages= await messageManager.getMessages();
      res.render('chat', { messages: messages, style: "style.css", title: "Mensajes" })
  }

const getRegister=async (req, res) => {
    res.render('register');
}

const getLogin= async(req, res) => {
    res.render('login');
}

const getCurrent= async (req, res) => {
  res.redirect('/api/sessions/current')
}
 
const getProfile=async (req, res) => {
    res.render('profile', {
        user: req.user
    });
}

const resetPassword=(req,res)=>{
  res.render('resetPassword');
}
 

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