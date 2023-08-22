import { Router } from "express";
import ProductController from "../controllers/products.controller.js";
import { passportCall } from "../utils.js";
import { adminAuth } from "./middlewares/roles.middleware.js"; 
import { ErrorEnum } from "../services/enum/error.enum.js";
import CustomError from "../services/Error/CustomError.class.js";
import { generateErrorInfo } from "../services/info.js";

let productController=new ProductController();

const router= Router(); 
//passportCall("jwt"),adminAuth,
router.post("/",  async(req,res)=>{

     const { firstName, lastName, age, email } = req.body;
     console.log(firstName, lastName, age, email)
  if (!firstName || !lastName || !email) {
    CustomError.createError({
      name: "user creation error",
      cause: generateErrorInfo({
        firstName,
        lastName,
        email,
      }),
      message: "error trying to create user",
      code: ErrorEnum.INVALID_TYPES_ERROR,
    });
  }

  const user = {
    firstName,
    lastName,
    email,
    age,
  };
  if (users.length === 0) {
    user.id = 1;
  } else {
    user.id = users[users.length - 1].id + 1;
  }
  users.push(user);
  res.send({ status: "success", payload: user });

    /*
    try{
        const product = req.body;
        const nuevoProducto=await productController.createProductController(product)
        req.socketServer.sockets.emit('nuevoProducto', nuevoProducto);
        res.send({ status: "success", nuevoProducto });
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})
    }
    */
   
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
 