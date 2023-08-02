import ProductManager from "../daos/mongodb/managers/ProductManager.class.js";
import socketServer, { productManager } from "../app.js";


const productosManager=new ProductManager()

const getProducts= async (req,res)=>{
    try{
        let limit=Number(req.query.limit);
        let page=Number(req.query.page); //pagina
        let sort=Number(req.query.sort); //ordenamiento   
        let filtro=req.query.filtro 
        let filtroVal=req.query.filtroVal
        const productos= await productManager.getProducts(limit,page,sort, filtro, filtroVal);
        res.send({productos});
    }catch(error){
        res.status(400).send({status: "error", details: "Hubo un error al traer los productos-"})
    }
}
 
const getProductById= async (req,res)=>{
    const id=req.params.id;
    try{
      const productoBuscado= await productosManager.getProductById(id);
      res.send({productoBuscado});
    }catch (error) {
      console.error(error);
      res.status(400).send({status: "failure", details: error.message}) // Envía el mensaje de error al cliente de Postman
    }    
}
  

const addProduct=async (req, res) => {
    try{
        const product = req.body;
        const nuevoProducto=productosManager.addProduct(product);
        req.socketServer.sockets.emit('nuevoProducto', nuevoProducto);
        res.send({ status: "success" });
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})
    }
  };

const updateProduct= async (req, res) => {
    try{
        const productId = req.params.id;
        const producto = req.body.description;
        console.log(req.body);
        const productoActualizado=productosManager.updateProduct(productId,producto);
        socketServer.emit('actualizarProducto', productoActualizado);
        res.send({ status: "success" });
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})
    }
    
  };

const deleteProduct= async (req, res) => {
    try{
        const productId = req.params.id; 
        const productoEliminado=productosManager.deleteProduct(productId);
        socketServer.emit('eliminarProducto', productoEliminado);
        res.send({ status: "success" });
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})     
    }
  }

  export default {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
  }