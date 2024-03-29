/*manejo de server con express */
import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';
import { Server } from "socket.io";
import routerCart from './routes/carts.router.js' 
import routerViews from './routes/views.router.js' 
import routerProductos from './routes/products.router.js'
import routerMessages from './routes/messages.router.js' 
import ProductManager from './daos/mongodb/daos/ProductMongo.dao.js';
import MessagesManager from './daos/mongodb/daos/MessagesMongo.dao.js';
import routerSession from './routes/session.router.js';
import { initializePassportJWT } from "./config/jwt.passport.js";
import { intializePassport } from "./config/local.passport.js";
import { initializePassportGithub }  from "./config/github.passport.js"; 
import passport from "passport";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import config from "./config.js";  
import { errorMiddleware } from "./services/middleware/error.middleware.js";
import { addLogger } from './logger.js' 
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

 

export const productManager = new ProductManager();
export const messagesManager = new MessagesManager();

const app=express();

app.use(addLogger);

const connection = mongoose.connect(
  config.MONGO_URL
); 

app.use(express.static(__dirname + '/public'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

//Inicializo Passport
intializePassport()
//uso passport
app.use(passport.initialize())
initializePassportJWT();
//cookieParser
app.use(cookieParser());
initializePassportGithub(); 
// configuracion de handlebars 
 



// Configurar Handlebars como motor de vistas
const hhh = handlebars.create({
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
    }
  }
});

app.engine('handlebars', hhh.engine);
//app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


const expressServer=app.listen(config.PORT,()=>{
  console.log("Servidor en Express - Listo - en puerto "+config.PORT)
})
 

//socket server io
const socketServer = new Server(expressServer);
const mensajes=[];
const productos=await productManager.getProducts();
 
 
socketServer.on("connection", (socket) => {
  //console.log("Nuevo Cliente conectado " + socket.id); 
  
  socketServer.emit('cargarProductos', productos);

  socket.on("message", data => {
    //  console.log(data);
  }); 

  socket.on("message", (data) => {
    //console.log(data)
    messagesManager.create(data.user,data.message);
    mensajes.push(data); 
    socketServer.emit("imprimir", mensajes);
  });

  socket.on("autenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });


});


const swaggerOptions = {
  definition: {
      openapi: '3.0.1',
      info: {
          title: 'Documentación Proyecto E-Commerce',
          description: 'Esta es la Documentación del Proyecto E-Commerce'
      },
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)


app.use((req,res,next)=>{
  req.socketServer=socketServer;
  next();
}) 

app.use('/apidocs',swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
app.use('/api/products/',routerProductos);
app.use('/api/carts/',routerCart);
app.use('/api/messages/',routerMessages);
app.use('/api/sessions/',routerSession);
app.use('/',routerViews); 
 app.use(errorMiddleware)

export default socketServer;