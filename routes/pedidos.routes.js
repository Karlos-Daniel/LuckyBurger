const{ Router }= require('express');
const {crearPedido, obtenerPedidos}=require('../controllers/pedidosController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearPedido',crearPedido);

router.get('/obtenerPedidos',obtenerPedidos)

module.exports = router;