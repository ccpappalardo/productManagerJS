import { Router } from "express"; 
import ProductManager from "../../daos/mongodb/ProductManager.class.js";
import ManagerCarts from "../../daos/mongodb/CartManager.class.js";
import MessagesManager from "../../daos/mongodb/MessagesManager.class.js" 
import passport from 'passport';

 
const router= Router();

const productosManager=new ProductManager()
const messageManager=new MessagesManager()
const managerCart = new ManagerCarts();
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
})  

router.get('/products/:id',async (req,res)=>{ 
  const id = req.params.id;
  let result = await productosManager.getProductById(id)
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