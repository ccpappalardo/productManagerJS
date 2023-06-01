/*manejo de server con express */
import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { Server } from "socket.io";
import routerCart from './routes/routes.carts.js' 
import routerViews from './routes/views.router.js' 
import routerProductos from './routes/routes.products.js'
import ProductManager from './classes/ProductManager.class.js';

export const productManager = new ProductManager(__dirname + "/files/products.json");

const app=express();



app.use(express.static(__dirname + '/public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// configuracion de handlebars 
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use('/api/products/',routerProductos);
app.use('/api/carts/',routerCart);
app.use('/',routerViews);

const expressServer=app.listen(8080,()=>{
    console.log("Servidor en Express - Listo")
})

//socket server io
const socketServer = new Server(expressServer);

const productos=await productManager.getProducts();
 
socketServer.on("connection", (socket) => {
  console.log("Nuevo Cliente conectado " + socket.id); 
  
  socketServer.emit('cargarProductos', productos);
  socket.on("message", data => {
      console.log(data);
  }); 
});

export default socketServer;