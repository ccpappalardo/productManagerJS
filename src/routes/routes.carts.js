import { Router } from "express";
import ManagerCarts from '../classes/CartManager.class.js'

const router= Router();

const managerCart = new ManagerCarts();


router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const cart = await managerCart.getCartById(id);
    res.send(cart);
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
 
export default router;