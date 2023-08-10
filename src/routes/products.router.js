import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

let productController=new ProductController();

const router= Router(); 

router.post("/", async(req,res)=>{
    try{
        const product = req.body;
        //const nuevoProducto=productosManager.addProduct(product);
        const nuevoProducto=await productController.createProductController(product)
        req.socketServer.sockets.emit('nuevoProducto', nuevoProducto);
        res.send({ status: "success", nuevoProducto });
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})
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


router.delete('/:id',async(req,res)=>{
    let id=req.params.id;
    const product=await productController.deleteProductController(id);
    res.send({product});
}) 

router.put('/:id',async(req,res)=>{
    const product=await productController.updateProductController(req);
    res.send({product});
}) 


 

export default router;
 