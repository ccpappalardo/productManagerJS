import ProductService from "../services/products.service.js";
import socketServer, { productManager } from "../app.js";  
import { ErrorEnum } from "../services/enum/error.enum.js";
import { generateErrorInfo } from "../services/info.js";
import CustomError from "../services/Error/CustomError.class.js";


export default class ProductController{
    constructor(){
        this.productService=new ProductService();
    }

    async createProductController(product){
      
        const {title, price, owner}=product;

        if(title=="" || !title){
            CustomError.createError({
                name: "product creation error",
                cause: generateErrorInfo({
                 title,
                 price
                }),
                message: "error trying to create product",
                code: ErrorEnum.INVALID_TYPES_ERROR,
              });
        } 

        if(price=="" || !price){
            CustomError.createError({
                name: "product creation error",
                cause: generateErrorInfo({
                 title,
                 price
                }),
                message: "error trying to create product",
                code: ErrorEnum.INVALID_TYPES_ERROR,
              });
        } 
        
        if(owner=="" || !owner){
            product.owner='admin';
        }
       
        const result=await this.productService.createProductService(product);
        return result;
        

    }

    async getProductsPaginadosController(req){
        let page = req.query.page;
        let limite=req.query.limit;
        let products = await this.productService.getProductsPaginadosService(limite,page);
         return products;
    }
    
    async getProductsController(req){
    try{
        let limit=Number(req.query.limit);
        let page=Number(req.query.page); //pagina
        let sort=Number(req.query.sort); //ordenamiento   
        let filtro=req.query.filtro 
        let filtroVal=req.query.filtroVal
        const productos= await this.productService.getProductService(limit,page,sort, filtro, filtroVal);
       return productos
    }catch(error){
        res.status(400).send({status: "error", details: "Hubo un error al traer los productos-"})
    }
}


async getProductByIdController(id){
    
    if(!id){
       console.error(error);
       res.status(400).send({status: "failure", details: error.message}) // Envía el mensaje de error al cliente de Postman
    }

    const productoBuscado= await this.productService.getProductByIdService(id);
      return productoBuscado;
    
}


async deleteProductController(productId){
    try{
        const productoEliminado= await this.productService.deleteProductService(productId);
        socketServer.emit('eliminarProducto', productoEliminado);
        return productoEliminado
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})     
    }
  }

  
 
  async updateProductController(req){
    
        const productId = req.params.id;
        const producto = req.body;
        console.log(req.body);
        const productoActualizado=await this.productService.updateProductService(productId,producto);
        //productosManager.updateProduct(productId,producto);
        socketServer.emit('actualizarProducto', productoActualizado);
        //res.send({ status: "success" });
     
  };


 
}
 