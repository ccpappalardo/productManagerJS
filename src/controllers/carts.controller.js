
import ManagerCarts from "../daos/mongodb/managers/CartManager.class.js";
const managerCart = new ManagerCarts();
 

const getCarts = async(req,res)=>{
    const carts = await managerCart.getCarts();
    res.send(carts);
} 

const getCartById = async(req,res)=>{
 
  const id = req.params.id;
  try{
    const cart = await managerCart.getCartById(id);
    res.send(cart);
    return await cart;
  }catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
}

const addCart = async(req,res)=>{
  await managerCart.addCart();
  res.send({ status: "success" });
}


const addProductInCart = async(req,res)=>{
  try{
    const cartId = req.params.cid;
    const productId = req.params.pid;
    await managerCart.addProductInCart(cartId, productId);
    res.send({ status: "success" });
  }catch(error){
    res.status(400).send({status: "failure", details: error.message})
  }
}

const deleteProductFromCart = async(req,res)=>{
    try{
      const cartId = req.params.cid;
      const productId = req.params.pid;
      await managerCart.deleteProductFromCart(cartId, productId);
      res.send({ status: "success" });
    }catch(error){
      res.status(400).send({status: "failure", details: error.message})
    }
}

const deleteAllProductsFromCart = async(req,res)=>{
  const cartId = req.params.cid;
  await managerCart.deleteAllProductsFromCart(cartId);
  res.send({ status: "success" });
}

const updateAllProductsFromCart = async(req,res)=>{
  let cartId = req.params.id
  let productos = req.body;
  const productoActualizado= await managerCart.updateAllProductsFromCart(cartId,productos);
  res.send({productoActualizado});
}

const updateProduct = async(req,res)=>{
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;
  const productoActualizado=updateProduct(cartId,productId,quantity); 
  res.send({productoActualizado});
}


export default {
  getCarts,
  getCartById,
  addCart,
  addProductInCart,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  updateAllProductsFromCart,
  updateProduct
}