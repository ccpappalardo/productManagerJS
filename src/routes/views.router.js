import { Router } from "express";
import ProductManager from '../classes/ProductManager.class.js'

const router= Router();

const productosManager=new ProductManager()

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
 

export default router;