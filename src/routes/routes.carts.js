import { Router } from "express";
import ManagerCarts from "../../daos/mongodb/CartManager.class.js";

const router= Router();

const managerCart = new ManagerCarts();


router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try{
      const cart = await managerCart.getCartById(id);
      res.send(cart);
    }catch (error) {
      console.error(error);
      res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
    }
    
  });


router.get('/', async (req,res)=>{     
    const carts = await managerCart.getCarts();
    res.send(carts);
})


router.post("/", async (req, res) => {
    await managerCart.addCart();
    res.send({ status: "success" });
  });

  
router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  await managerCart.addProductInCart(cartId, productId);
  res.send({ status: "success" });
}); 

router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  await managerCart.deleteProductFromCart(cartId, productId);
  res.send({ status: "success" });
}); 
 
router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid; 
  await managerCart.deleteAllProductsFromCart(cartId);
  res.send({ status: "success" });
}); 

router.put("/:id", async (req, res) => {
  const cartId = req.params.id;
  const productos = req.body;
  console.log(productos)
  const productoActualizado=managerCart.updateAllProductsFromCart(cartId,productos);
  res.send({productoActualizado});
  
});

router.put("/:cid/products/:pid", async (req, res) => { 
   const cartId = req.params.cid;
   const productId = req.params.pid;
   const quantity = req.body.quantity;
   const productoActualizado=managerCart.updateProduct(cartId,productId,quantity); 
   res.send({ status: "success" });
   
 });

export default router;