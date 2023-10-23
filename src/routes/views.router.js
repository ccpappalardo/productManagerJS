import { Router } from "express"; 
import ViewsController from "../controllers/views.controllers.js" 
import passport from 'passport';
import { multipleAuthMiddleware } from "./middlewares/roles.middleware.js";

 
const router= Router();
  
const viewController=new ViewsController();

router.get('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
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
  let user=req.user;
  let result=await viewController.getProductByIdController(id);
  res.render('product',result) 
})


router.get('/carts/:id', passport.authenticate('jwt', {session: false}), async (req,res)=>{ 
    const id = req.params.id;
  try{
    let user=req.user; 
    const cart = await viewController.getAllProductsFromCartController(id);
    res.render('cart',
     {cart:cart,
      cartId:id,
      user:user}) 
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }

})
 
 
router.get('/realtimeproducts', async (req, res) => {
    const productos=await viewController.getProductsController(req,res,req.query.limit)
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

router.get('/resetPassword',passport.authenticate("jwtRequestPassword",{failureRedirect:'requestResetPassword',session: false}),(req,res)=>{
  res.render('resetPassword');
})  

router.get('/requestResetPassword',(req,res)=>{
  res.render('requestResetPassword');
})

router.get("/mockingproducts", async (req, res) => {
  const product=await viewController.generateMockProductsController(req);
  res.send({product});
});


router.get("/documents", async (req, res) => {
  res.render('documents');
});
 
router.get("/admin", 
passport.authenticate("jwt",{session: false}),
multipleAuthMiddleware(["admin"],{failureRedirect:'requestResetPassword'}), (req, res) => {
  viewController.getUsersController(req,res); 
}) 


router.get("/ticket/:id",
passport.authenticate("jwt",{session: false}), (req, res) => {

  const id = req.params.id;
 
  try{ 
     viewController.getTicket(id,res,req);
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
   
})  

export default router;