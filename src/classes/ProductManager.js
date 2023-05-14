import fs from 'fs'

const path='src/classes/files/productos.json';//Clase para gestionar un conjunto de Productos

export default class ProductManager{
    
    
    //Constructor que crea un array de productos vacíos . le pasamos el path por parámetro
    constructor(){
        this.path=path;
        this.products=[];
    }
 
    //funcion para agregar productos al archivo
    
    addProduct = async (product) => {
        const products = await this.getProducts();
        this.products=products;
        this.products.length==0? product.id=1 : product.id=this.products[this.products.length-1].id+1;
        this.products.push(product)
        await fs.promises.writeFile(path,JSON.stringify(products,null,'\t'))
        return product 

        
    }
   
    //Lee los productos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
    getProducts= async(limite)=>{
        if(fs.existsSync(path)){
            const data=await fs.promises.readFile(this.path,'utf-8')
            let productos=JSON.parse(data)

            if(limite){
               productos=productos.slice(0,limite);
            } 
            return productos
        }else{
            return []
        }
    } 

    
   //Recibe un codigo de producto y lo devuelve en formato de objeto
    getProductByCode = async (code) => {
        const products = await this.getProducts();
        this.products=products;
        const producto = this.products.find((product)=>{
            return product.code===code
        });

        return !producto? console.log("Producto no encontrado") : producto;
    }
 
   //Recibe un id de producto y lo devuelve en formato de objeto
    getProductById = async (productoId) => {
        const products = await this.getProducts();
        this.products=products;

        const producto = this.products.find((product)=>{
            return product.id==productoId
        });
        return !producto? console.log("Producto no encontrado") : producto;
    }

   //Actualizo producto por el id, propiedad y valor que le seteo
    updateProduct = async (productoId,propiedad,valor) => {

        const products = await this.getProducts();
        this.products=products;
        const productById = await this.getProductById(productoId);
        if (productById === undefined) {
          console.log("Error, no se puede actualizar un producto que no existe");
          return;
        } 
      
        const productoBuscado = await this.products.find(
            (producto) => producto.id === productoId
        );

        productoBuscado[propiedad]=valor; 

        await fs.promises.writeFile(this.path,JSON.stringify(this.products,null,'\t'))
        console.log("El Producto se ha actualizado con Éxito");
    }
   
   //Metodo que elimina producto del array por Id pasado por parámetro
   deleteProduct= async (productoId) => {
        const products = await this.getProducts();
        this.products=products;

        //Mejoro con filter para cuando elimina un producto
        const poductosFiltrados=this.products.filter((product)=>{
            return product.id!=productoId;
        })
        await fs.promises.writeFile(this.path,JSON.stringify(poductosFiltrados,null,'\t'))
        console.log("El Producto ha sido eliminado con éxito");
        
   }
  
   
}
 