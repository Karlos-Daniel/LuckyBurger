const{ Router }= require('express');
const {crearPedido}=require('../controllers/pedidosController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearPedido',crearPedido);

module.exports = router;