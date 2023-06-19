import { Router } from "express";
//import ProductManager from '../classes/ProductManager.class.js'
import ProductManager from "../../daos/mongodb/ProductManager.class.js";
import socketServer, { productManager } from "../app.js";

const router= Router();

const productosManager=new ProductManager()

router.get('/', async (req,res)=>{
    const productos= await productosManager.getProducts(req.query.limit);
    res.send({productos});
})

router.get('/:id', async (req,res)=>{
    const id=req.params.id;

    try{
      const productoBuscado= await productosManager.getProductById(id);
      res.send({productoBuscado});
    }catch (error) {
      console.error(error);
      res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
    }    
})
  

router.post("/", async (req, res) => {
    const product = req.body;
    const nuevoProducto=productosManager.addProduct(product);
    req.socketServer.sockets.emit('nuevoProducto', nuevoProducto);
    res.send({ status: "success" });
  });

 
router.put("/:id", async (req, res) => {
    const productId = req.params.id;
    const producto = req.body.description;
    console.log(req.body);
    const productoActualizado=productosManager.updateProduct(productId,producto);
    socketServer.emit('actualizarProducto', productoActualizado);
    res.send({ status: "success" });
    
  });

  
router.delete("/:id", async (req, res) => {
    const productId = req.params.id; 
    const productoEliminado=productosManager.deleteProduct(productId);
    socketServer.emit('eliminarProducto', productoEliminado);
    res.send({ status: "success" });
  }); 


export default router;