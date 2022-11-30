const express = require('express');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const {dbConnection} = require('../database/config');
const routesCategoria = require('../routes/categorias.routes');
const routesProveedor = require('../routes/proveedor.routes');
const routesIngreso = require('../routes/ingreso.routes');
const rutaPrueba = require('../controllers/pruebasJsonController');
const routesProducto = require('../controllers/productoController');
class server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        
        //DB
        this.conectarDB();

        //Middlewares
        this.middlewares();
                
        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        
        this.app.use(cors());//cors
        this.app.use(express.json());
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes(){
        
        this.app.use(routesCategoria);
        this.app.use(routesProveedor);
        this.app.use(routesIngreso);
        this.app.use(rutaPrueba);
        this.app.use(routesProducto);
                
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`SERVIDOR CORRIENDO EN http://localhost:${this.port}/`);
        });
    }

}

module.exports=server;