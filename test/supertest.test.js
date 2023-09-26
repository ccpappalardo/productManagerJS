import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");
let currentUser;
let CoderCookie;

describe("Test General del Sistema", () => {
  
  //Test de Usuarios
  describe("Test de Usuarios", () => {
 

    it("POST /api/sessions/login logear un usuario", async () => {
      const mockUser = {
        //email:"adminCoder@coder.com",
        //password: "adminCod3r123",
        email: "ccpappalardo@gmail.com",
        password: "123456"
      };
      const result = await requester.post("/api/sessions/login").send(mockUser);
         
      const cookieResult = result.headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      CoderCookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
    
    }).timeout(10000);
    

    
    it("GET api/sessions/current", async () => {
      const result = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`]);
      currentUser=result.body;
     
      expect(result.body).to.have.all.keys('edad','nombre','email','role','cart');
      
      expect(result.body).to.be.ok;
    }).timeout(10000);

  }); 


  //Test de Productos
  
  describe("Test de Productos", () => {
    
   /* it("POST api/products/ debe crear un producto correctamente", async () => {
      //Producto de prueba
      const mockProducts = {
        title: "productoo de prueba5",
        description: "producto  de prueba",
        code: 225514,
        category: "Grocery",
        price: "332.00",
        stock: 3
      };
    
      // Enviamos el producto de prueba
      console.log(CoderCookie);
      const result = await requester
        .post("/api/products")
        .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
        .send(mockProducts); 
    
      expect(result.ok).to.be.ok;
      expect(result.body.nuevoProducto).to.have.property("_id");
    }).timeout(10000);
    

    */
    
    it("GET api/products/:id obtiene el producto por id", async () => {
   
      const productId = "6511ff705be21694a77dd965";
      const request = await requester
      .get("/api/products/" + productId)
      .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
     // console.log(request);
      expect(request._body.product).to.have.property("_id"); 
      expect(request.statusCode).to.be.equal(200);
    }).timeout(10000);

    /*
    it("PUT api/products/:id debe actualizar el producto", async () => {
      const mockProduct = {
        stock: 15,
      };
      const productId = "64ffc9ced1a5ac5d56161a79";
      const {_body} = await requester
      .put("/api/products/" + productId)
      .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
      .send(mockProduct);

      expect(_body.productoActualizado.acknowledged).to.be.equal(true);
    }).timeout(10000);
 
    
    it("DELETE api/products/:id debe eliminar el producto", async () => {
      const productId = "64ffc9ced1a5ac5d56161a79";
      const { _body } = await requester
      .delete("/api/products/" + productId)
      .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`]);

      expect(_body.product.acknowledged).to.be.equal(true); 
    }).timeout(10000);
    */

  });


  describe("Test de Carritos", () => {
    
    /*
     it("POST api/carts/ debe crear un carrito correctamente", async () => {
      // Enviamos el producto de prueba
       console.log(CoderCookie);
       const result = await requester
         .post("/api/carts")
         .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
     
       expect(result.ok).to.be.ok;
       expect(result.body.result).to.have.property("_id");
     }).timeout(10000);
     
      */
     it("GET api/carts/:id obtiene el carrito por id", async () => {
    
       const cartId = "64ffe233cdf7c50e6f8715bd";
       const request = await requester
       .get("/api/products/" + cartId)
       .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
       expect(request.statusCode).to.be.equal(200);
     }).timeout(10000);
 
     /*
     
     it("PUT api/carts/:id debe actualizar el cart", async () => {
       const mockCart = {
        "product": "65121139a7f98fcf3b1675d2",
        "quantity": 2
       };
       const cartId = "64ffe233cdf7c50e6f8715bd";
       const {request} = await requester
       .put("/api/products/" + cartId)
       .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
       .send(mockCart);
       //console.log(request);
       expect(request.statusCode).to.be.equal(200);
     }).timeout(10000);
     */

    /*
     it("DELETE api/carts/:id debe eliminar el producto", async () => {
       const cartId = "64ffe233cdf7c50e6f8715bd";
       const { _body } = await requester
       .delete("/api/carts/" + cartId)
       .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`]);
       console.log(_body);
      // expect(_body.product.acknowledged).to.be.equal(true); 
     }).timeout(10000);
    */

     //64ffe151cdf7c50e6f8715b3 cartId
     //productId - 6511ff705be21694a77dd965

     
     it("PUT api/carts/:cid/products/:pid debe actualizar un producto en especifico de un carrito especifico", async () => {
      const cartId = "64ffe233cdf7c50e6f8715bd";
      const productId ="64ffe151cdf7c50e6f8715b3";      
      const quantity = { "quantity": 5 };
      const {request} = await requester
      .put("/api/carts/" + cartId+"/products/"+productId)
      .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
      .send(quantity);

      expect(request.ok).to.be.ok;
    }).timeout(10000);

   });



});
