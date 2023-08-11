import ProductDAO from "../daos/mongodb/daos/ProductMongo.dao.js"


export default class ProductService {

    constructor(){
        this.productDao= new ProductDAO();
    }
 
    async createProductService(product){
        const result=await this.productDao.addProduct(product);
        return result;
    }

    async getProductService(limit, page, sort, filtro, filtroVal){
    
        const result=await this.productDao.getProducts(limit, page, sort, filtro, filtroVal)
        return result;

    }
   
    async getProductsPaginadosService(limite,page){

        const result=await this.productDao.getProductsPaginados(limite, page)
        return result;
    }

    async getProductByIdService(id){
    
        const result=await this.productDao.getProductById(id)
        return result;

    }

    async deleteProductService(id){
    
        const result=await this.productDao.deleteProduct(id)
        return result;

    }

    
    async updateProductService(id,producto){
    
        const result=await this.productDao.updateProduct(id,producto);
        return result;

    }


}