/*manejo de server con express */
import express from 'express';
import ProductManager from './classes/ProductManager.js';

const app=express();

const productosManager=new ProductManager()

app.get('/productos', async (req,res)=>{
    const productos= await productosManager.getProducts(req.query.limit);
    res.send(productos);
})

app.get('/productos/:id', async (req,res)=>{
    const productoBuscado= await productosManager.getProductById(req.params.id);
    res.send(productoBuscado);
})

app.listen(8080,()=>{
    console.log("Servidor en Express - Listo")
})
