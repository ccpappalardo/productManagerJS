import ProductService from "../services/products.service.js";
import socketServer, { productManager } from "../app.js";  
import { ErrorEnum } from "../services/enum/error.enum.js";
import { generateErrorInfo } from "../services/info.js";
import CustomError from "../services/error/CustomError.class.js";
import { config } from "dotenv";
import SessionService from "../services/session.service.js";


export default class ProductController{
    constructor(){
        this.productService=new ProductService();
        this.sessionService=new SessionService();
    }

    async createProductController(product, req){
      
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

        if (req.user.email != config.ADMIN_NAME) {
            product.owner = req.user.email 
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


async deleteProductController(req,res){
    try{
        let id=req.params.id;
        const productoBuscado= await this.productService.getProductByIdService(id);

        //Controlo que el usuario que borra el producto sea admin o el owner del mismo
        if (!(req.user.role === "admin" || productoBuscado.owner === req.user.email) ) {
            return res.status(403).
            send({ status: "failure", details: "No está permitido que borres este producto, ya que no te pertenece o no sos admin" })
        } 
        
        if(req.user.role === "premium"){
            let html = `<h1>Correo de Aviso de Eliminación de Producto - ${req.user.email}</h1>`
            html = html.concat(
              `<div><h1>Se le informa que se ha eliminado el producto, que usted ha creado.
              Producto: ${productoBuscado.title} - Id: ${productoBuscado._id} </div>`);
            let asunto="Correo de Aviso de eliminación de Producto";
            this.sessionService.enviarCorreo(req.user.email,asunto,html);
        }

        const productoEliminado= await this.productService.deleteProductService(id);
        
        res.status(200).send({status: "success",productoEliminado});
    }catch(error){
        res.status(400).send({status: "failure", details: error.message})     
    }
  }

  
 
  async updateProductController(req,res){
    
        const productId = req.params.id;
        const producto = req.body; 
        
        const productoBuscado= await this.productService.getProductByIdService(productId);
        
        //Controlo que el usuario que actualiza el producto sea admin o el owner del mismo
        if (!(req.user.role === "admin" || productoBuscado.owner === req.user.email) ) {
            return res.status(403).
            send({ status: "failure", details: "No está permitido que actualices este producto, ya que no te pertenece o no sos admin" })
        } 

        const productoActualizado=await this.productService.updateProductService(productId,producto);
        socketServer.emit('actualizarProducto', productoActualizado);
        res.send({productoActualizado}); 
  };
 
}
