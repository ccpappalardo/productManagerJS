import fs from "fs";
import { v4 as uuidV4 } from "uuid";
const path = "src/classes/files/carts.json";

export default class ManagerCarts {

  
    //Lee los carritos del archivo si es que existe los devuelve en formato de array, 
    //sino devuelve un array vacio
  getCarts = async () => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, "utf-8");
      const carts = JSON.parse(data);
      return carts;
    } else {
      return [];
    }
  };

  //funcion para agregar carritos al archivo
  addCart = async () => {
    const carts = await this.getCarts();
    carts.push({ id: uuidV4(), products: [] });
    return await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
  };

  
   //Recibe un id de carrito y lo devuelve en formato de objeto
  getCartById = async (carritoId) => {
    const carts = await this.getCarts();

    const cart = carts.find((cart) => {
      return cart.id == carritoId;
    });

    if(cart){
      return cart
    }
    else {
      const mensaje = "Carrito No encontrado";
      throw new Error(mensaje);
    }
     
  };

  //Agrego a un carrito especifico un producto especifico
  addProductInCart = async (carritoId, productoId) => {

    const cart = await this.getCartById(carritoId);
    
    //busco el indice del carrito
    const index = cart.products.findIndex((product) => {
      return product.id == productoId;
    });

    //si encuentro el producto, actualizo la cantidad, sino le pongo 1
    if (index == -1) {
      cart.products.push({ id: productoId, quantity: 1 });
    } else {
      cart.products[index].quantity++;
    }

    const carts = await this.getCarts()
    const cartIndex = carts.findIndex((carrito)=>{
        return carrito.id == cart.id
    })
    //actualizo el carrito en su indice encontrado
    carts[cartIndex] = cart
    //lo persisto
    return await fs.promises.writeFile(path, JSON.stringify(carts, null,"\t" ))

  };
}
