/*manejo de server con express */
import express from 'express';
import routerProductos from './routes/routes.products.js'
import routerCart from './routes/routes.carts.js' 

const app=express();

 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
 
app.use('/api/products/',routerProductos);
app.use('/api/carts/',routerCart);

app.listen(8080,()=>{
    console.log("Servidor en Express - Listo")
})
