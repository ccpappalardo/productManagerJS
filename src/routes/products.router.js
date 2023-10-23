import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import { passportCall } from "../utils.js";
import { adminAuth, multipleAuthMiddleware, premiumAuth } from "./middlewares/roles.middleware.js";  

let productController=new ProductController();

const router= Router(); 

router.post("/", passportCall("jwt"),multipleAuthMiddleware(["admin","premium"]), async(req,res, next)=>{
    try{
        const product = req.body;
        const nuevoProducto=await productController.createProductController(product,req)
        req.socketServer.sockets.emit('nuevoProducto', nuevoProducto);
        res.send({ status: "success", nuevoProducto });
    }catch(error){
        return next(error);   
    }    
   
});

router.get('/', async(req,res)=>{
    const productos=await productController.getProductsController(req);
    res.send({productos});
})

router.get('/:id',async(req,res)=>{
    let id=req.params.id;
    const product=await productController.getProductByIdController(id);
    res.send({product});
}) 


router.delete('/:id', passportCall("jwt"),multipleAuthMiddleware(["admin","premium"]),async(req,res)=>{
   
 await productController.deleteProductController(req,res);
  
}) 

router.put('/:id', passportCall("jwt"),multipleAuthMiddleware(["admin","premium"]), async(req,res)=>{
    const product=await productController.updateProductController(req,res);
}) 
 

export default router;
 