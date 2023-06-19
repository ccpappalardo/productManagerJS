import { Router } from "express";
//import ProductManager from '../classes/ProductManager.class.js'
import ProductManager from "../../daos/mongodb/ProductManager.class.js";
import MessagesManager from "../../daos/mongodb/MessagesManager.class.js"

const router= Router();

const productosManager=new ProductManager()
const messageManager=new MessagesManager()

router.get('/', async (req,res)=>{
    const productos= await productosManager.getProducts(req.query.limit);
    res.render('home', {
      products: productos,
      style:"style.css"
    })
})

router.get('/realtimeproducts', async (req, res) => {
    const productos= await productosManager.getProducts(req.query.limit);
      res.render('realTimeProducts', { products: productos, style: "style.css", title: "Productos" })

  });
 

  router.get('/chat', async (req, res) => {
    const messages= await messageManager.getMessages();
      res.render('chat', { messages: messages, style: "style.css", title: "Mensajes" })

  });
 

export default router;