const{ Router }= require('express');
const {crearPedido, obtenerPedidos, editarProductoPedido, obtenerVentas, borrarProductoPedido, editarVenta, borrarVenta, agregarProducto, obtenerProductosPedido, editarPedido, borrarPedido}=require('../controllers/pedidosController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearPedido',crearPedido);//LISTO

router.put('/editarPedido/:idVenta',editarPedido);//LISTO

router.delete('/borrarPedido/:idVenta',borrarPedido);

router.get('/obtenerPedidos',obtenerPedidos);//LISTO

router.get('/obtenerVentas',obtenerVentas);//LISTO

router.get('/productos/pedido/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
],obtenerProductosPedido);//LISTO




module.exports = router;