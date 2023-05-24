import { Router } from "express";
import ProductManager from '../classes/ProductManager.class.js'

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
    productosManager.addProduct(product);
    res.send({ status: "success" });
  });

 
router.put("/:id", async (req, res) => {
    const productId = req.params.id;
    const description = req.body.description;
    console.log(req.body);
    productosManager.updateProduct(productId,"description",description);
    res.send({ status: "success" });
    
  });

  
router.delete("/:id", async (req, res) => {
    const productId = req.params.id; 
    productosManager.deleteProduct(productId);
    res.send({ status: "success" });
  }); 


export default router;