const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();


const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {

  origin: function(origin, callback) {
    if(dominiosPermitidos.indexOf(origin) !==-1){
      //El origen del Request esta permitido
      callback(null, true);
    }
    else{
      callback(new Error('No permitido por CORS'))
      
    }
  }

};


// CORS
app.use(cors( corsOptions));
// Directorio Público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );


const PORT = process.env.PORT || 4000;

// Escuchar peticiones
app.listen( PORT, () => {
    console.log(`Servidor corriendo en puerto ${ PORT }`);
});



