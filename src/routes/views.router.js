import { Router } from "express"; 
//import ProductManager from "../daos/mongodb/daos/ProductMongo.dao.js";
import ProductController from "../controllers/products.controller.js";
import ViewsController from "../controllers/views.controllers.js"
import ManagerCarts from "../daos/mongodb/daos/CartMongo.dao.js";
import MessagesManager from "../daos/mongodb/daos/MessagesManager.dao.js" 
import passport from 'passport';

 
const router= Router();

//const productosManager=new ProductManager()
const productController=new ProductController();
const messageManager=new MessagesManager()
const managerCart = new ManagerCarts();
const viewController=new ViewsController();
/*
router.get('/', async (req,res)=>{
    const productos= await productosManager.getProducts(req.query.limit);
    res.render('home', {
      products: productos,
      style:"style.css"
    })
})*/



/*router.get('/', async (req,res)=>{
    const productos= await productosManager.getProducts(req.query.limit);
    res.render('profile', {
      user: req.session.user
    });
})*/

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
  //const productos= await productosManager.getProducts(req.query.limit);
  res.render('profile', {
      user: req.user
  });
})


router.get('/products', passport.authenticate('jwt', {session: false}),async (req,res)=>{
  let user=req.user;
  let products= await viewController.getProductsPaginadosController(req,res)
  
  res.render('home', {
    title: "productos",
    products: products,
    user: user
  });
})  

router.get('/products/:id',async (req,res)=>{ 
  const id = req.params.id;
let result=await viewController.getProductByIdController(id);
  //let result =  await productController.getProductByIdController(id);  
  //let result = await productosManager.getProductById(id)
  res.render('product',result) 
})

/*
router.get('*', async(res,send)=>{
  res.status(404).send("No existe la pagina");
})
*/
router.get('/carts/:id',async (req,res)=>{ 
    const id = req.params.id;
  try{
    const cart = await managerCart.getAllProductsFromCart(id);
    res.render('cart',cart) 
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }

})
 
 
router.get('/realtimeproducts', async (req, res) => {
    const productos= await productosManager.getProducts(req.query.limit);
      res.render('realTimeProducts', { products: productos, style: "style.css", title: "Productos" })

  });
 

  router.get('/chat', async (req, res) => {
    const messages= await messageManager.getMessages();
      res.render('chat', { messages: messages, style: "style.css", title: "Mensajes" })

  });


  router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})


router.get('/current', (req, res) => {
  res.redirect('/api/sessions/current')
})
 

router.get('/', passport.authenticate("jwt",{session: false}), (req, res) => {
    res.render('profile', {
        user: req.user
    });
})

router.get('/resetPassword',(req,res)=>{
  res.render('resetPassword');
})
 

export default router;