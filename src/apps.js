import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import mongoose  from 'mongoose';
import __dirname from '../src/utils.js';
import handlebars from 'express-handlebars';
import viewRouter from './routes/view.router.js';
import {Server} from 'socket.io';
import {MONGODB_URI} from './public/config.js';

const port = 8080;
const app = express();

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(`${__dirname}/public`));

const httpServer = app.listen(port, ()=>console.log('Listening on port ' + port));
const io= new Server(httpServer);

// Conexión con MONGO
mongoose.connect(MONGODB_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

app.use('/',viewRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

 const messages=[];
io.on('connection',socket=>{ // cambio 
     console.log("Tenemos un cliente conectado");
     socket.on('message', data=>{
          data.fyh = new Date().toLocaleString();
          messages.push(data);
          io.emit('messageLogs',messages);
      })
      socket.on('authenticated',data=>{
          socket.broadcast.emit('newUserConnected',data);
      })
})  