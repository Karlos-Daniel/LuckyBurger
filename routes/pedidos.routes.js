const{ Router }= require('express');
const {crearPedido, obtenerPedidos, editarProductoPedido, obtenerVentas, borrarProductoPedido, editarVenta, borrarVenta, agregarProducto, obtenerProductosPedido}=require('../controllers/pedidosController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearPedido',crearPedido);//LISTO

router.get('/obtenerPedidos',obtenerPedidos);//LISTO
router.get('/obtenerVentas',obtenerVentas);//LISTO

router.get('/productos/pedido/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
],obtenerProductosPedido);//LISTO

//esto va a editar producto en detallesVenta
router.put('/editar/ProductoPedido/:idProducto/:idVenta',[
    check('idProducto','No es un ID valido de MongoDB').isMongoId(),
    check('idVenta','No es un ID valido de MongoDB').isMongoId(),
],editarProductoPedido);//LISTO

//agrega producto a una venta
router.post('/agregarProducto/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
],agregarProducto)//LISTO

//esto va a borrar producto en detallesVenta
//ID tiene que ser de detalles venta
//middleware para ver si existe venta
router.delete('/borrar/productoPedido/:idProducto/:idVenta',[
    check('idProducto','No es un ID valido de MongoDB').isMongoId(),
    check('idVenta','No es un ID valido de MongoDB').isMongoId(),
],borrarProductoPedido);//LISTO

//esto va a editar el valor de Ventas
router.put('/editar/venta/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
],editarVenta);//LISTO

//esto va a borrar la venta
router.delete('/borrar/venta/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
],borrarVenta);//LISTO


module.exports = router;