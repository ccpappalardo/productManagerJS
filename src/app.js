/*manejo de server con express */
import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { Server } from "socket.io";
import routerCart from './routes/routes.carts.js' 
import routerViews from './routes/views.router.js' 
import routerProductos from './routes/routes.products.js'
import routerMessages from './routes/routes.messages.js' 
import ProductManager from '../daos/mongodb/ProductManager.class.js';
import MessagesManager from '../daos/mongodb/MessagesManager.class.js';
import routerSession from './routes/session.router.js';
import session from "express-session";
import MongoStore from "connect-mongo";

export const productManager = new ProductManager();
export const messagesManager = new MessagesManager();

const app=express();

app.use(express.static(__dirname + '/public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//configuración de session - mongoDB
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://ccpappalardo:xSI4tapwfkxSAbeC@cluster0.gcl8y5w.mongodb.net/ecommerce?retryWrites=true&w=majority",
    }),
    secret: "passSecret",
    resave: true,
    saveUninitialized: false,
  })
);
// configuracion de handlebars 
 
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const expressServer=app.listen(8080,()=>{
    console.log("Servidor en Express - Listo")
})

//socket server io
const socketServer = new Server(expressServer);
const mensajes=[];
const productos=await productManager.getProducts();
 
 
socketServer.on("connection", (socket) => {
  console.log("Nuevo Cliente conectado " + socket.id); 
  
  socketServer.emit('cargarProductos', productos);

  socket.on("message", data => {
      console.log(data);
  }); 

  socket.on("message", (data) => {
    console.log(data)
    messagesManager.create(data.user,data.message);
    mensajes.push(data); 
    socketServer.emit("imprimir", mensajes);
  });

  socket.on("autenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });


});

app.use((req,res,next)=>{
  req.socketServer=socketServer;
  next();
})
 
app.use('/api/products/',routerProductos);
app.use('/api/carts/',routerCart);
app.use('/api/messages/',routerMessages);
app.use('/api/sessions',routerSession);
app.use('/',routerViews);


export default socketServer;