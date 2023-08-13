import { Router } from "express";
import CartController from "../controllers/carts.controller.js";
import { passportCall} from "../../src/utils.js";
import { permiteAgregarAsuCarrito } from "./middlewares/carts.middleware.js";
import { userAuth } from "./middlewares/roles.middleware.js";

const router= Router();
const cartController=new CartController() 

router.post("/",  async(req,res)=>{
 const result=await cartController.createCartController()
 res.send({result})
});

router.get("/:id", async(req,res)=>{  
  const id = req.params.id;
  console.log(id)
  let cart=await cartController.getCartByIdController(id)  
  res.send(cart);
});

router.get("/", async(req,res)=>{
  let carts=await cartController.getCartsController();
  console.log("carts en router"+carts)
  res.send(carts);

}); 

//Sólo el usuario puede agregar productos a su carrito.
router.post("/:cid/products/:pid",passportCall("jwt"),userAuth,permiteAgregarAsuCarrito,async(req,res)=>{
  try{
    const cartId = req.params.cid;
    const productId = req.params.pid;
    //await managerCart.addProductInCart(cartId, productId);
    let carts=await cartController.addProductInCartController(cartId,productId);
    res.send({ status: "success" });
  }catch(error){
    res.status(400).send({status: "failure", details: error.message})
  }
});  

//Elimina solo un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  let cart=await cartController.deleteProductFromCartController(cartId,productId);
  res.send(cart);  
});


//Elimina todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  
  const cartId = req.params.cid;
  console.log("id carrito en router"+cartId)
  let cart=await cartController.deleteAllProductsFromCartController(cartId);
  res.send(cart);
  //res.send({ status: "success" });
});


router.put("/:cid/products/:pid", async (req, res) => {
  let cart=await cartController.updateProductFromCartController(req);
  res.send(cart);
//  cartsController.updateProduct
});

router.put("/:cid",async (req, res) => {
  let cart=await cartController.updateAllProductsFromCartController(req);
  res.send(cart);
  
});
 

export default router;
