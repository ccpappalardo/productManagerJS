import chai from "chai";
import supertest from "supertest";
import config from "../src/config";

const expect = chai.expect;
const requester = supertest("http://localhost:"+config.PORT);
let currentUser;
let CoderCookie;

describe("Test General del Sistema", () => {
  
  //Test de Usuarios
  describe("Test de Usuarios", () => {
 

    it("POST /api/sessions/login logear un usuario", async () => {
      const mockUser = {
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
     
    
    it("GET api/products/:id obtiene el producto por id", async () => {
   
      const productId = "6511ff705be21694a77dd965";
      const request = await requester
      .get("/api/products/" + productId)
      .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
      expect(request._body).to.have.property("product"); 
      expect(request.statusCode).to.be.equal(200);
    }).timeout(10000);
 

  });


  describe("Test de Carritos", () => {
 
     it("GET api/carts/:id obtiene el carrito por id", async () => {
    
       const cartId = "64ffe233cdf7c50e6f8715bd";
       const request = await requester
       .get("/api/products/" + cartId)
       .set("Cookie", [`${CoderCookie.name}=${CoderCookie.value}`])
       expect(request.statusCode).to.be.equal(200);
     }).timeout(10000);
   
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
