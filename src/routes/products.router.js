import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import { passportCall } from "../utils.js";
import { adminAuth } from "./middlewares/roles.middleware.js"; 
import { ErrorEnum } from "../services/enum/error.enum.js";
import CustomError from "../services/Error/CustomError.class.js";
import { generateErrorInfo} from "../services/info.js";

let productController=new ProductController();

const router= Router(); 

router.post("/", passportCall("jwt"),adminAuth, async(req,res, next)=>{
    try{
        const product = req.body;
        const nuevoProducto=await productController.createProductController(product)
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


router.delete('/:id', passportCall("jwt"),adminAuth,async(req,res)=>{
    let id=req.params.id;
    const product=await productController.deleteProductController(id);
    res.send({product});
}) 

router.put('/:id', passportCall("jwt"),adminAuth, async(req,res)=>{
    const product=await productController.updateProductController(req);
    res.send({product});
}) 
 

export default router;
 