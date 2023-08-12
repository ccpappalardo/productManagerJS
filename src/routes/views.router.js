import { Router } from "express"; 
import ViewsController from "../controllers/views.controllers.js" 
import passport from 'passport';

 
const router= Router();
  
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
    const cart = await viewController.getAllProductsFromCartController(id);
    res.render('cart',cart) 
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }

})
 
 
router.get('/realtimeproducts', async (req, res) => {
    const productos=await viewController.getProductsController(req,res,req.query.limit)
    //const productos= await productosManager.getProducts(req.query.limit);
    res.render('realTimeProducts', { products: productos, style: "style.css", title: "Productos" })

  });
 

  router.get('/chat', async (req, res) => {
   await viewController.getChatController(req,res);  
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