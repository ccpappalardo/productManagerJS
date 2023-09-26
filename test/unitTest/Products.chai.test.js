import mongoose from "mongoose";
import ProductDAO from "../../src/daos/mongodb/daos/ProductMongo.dao.js";
import chai from 'chai' 
import config from "../../src/config.js";
import { createHash, validatePassword } from "../../src/utils.js";

const connection = mongoose.connect(
    config.MONGO_URL
);

const expect = chai.expect

describe('Testing Products Dao', ()=>{
    let productsDao
    before(async function(){
        productsDao = new ProductDAO()
    })

    it('Se modifica el stock de un producto', async function() {
      
        let product = await productsDao.getProductById("6511ff705be21694a77dd965");      
        product.stock=99;
        await productsDao.updateProduct(product._id,product);    
        let productActualizado = await productsDao.getProductById("6511ff705be21694a77dd965");    
        expect(productActualizado).to.have.property("stock").and.to.be.equal(99);
      }).timeout(10000);
})