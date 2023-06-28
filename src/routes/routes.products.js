import { Router } from "express";
//import ProductManager from '../classes/ProductManager.class.js'
import ProductManager from "../../daos/mongodb/ProductManager.class.js";
import socketServer, { productManager } from "../app.js";

const router= Router();

const productosManager=new ProductManager()

router.get('/', async (req,res)=>{
    let limit=Number(req.query.limit);
    let page=Number(req.query.page); //pagina
    let sort=Number(req.query.sort); //ordenamiento   
    let filtro=req.query.filtro 
    let filtroVal=req.query.filtroVal
    const productos= await productManager.getProducts(limit,page,sort, filtro, filtroVal);


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