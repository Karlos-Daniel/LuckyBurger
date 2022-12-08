const{ Router }= require('express');
const {crearCompra, obtenerCompras}=require('../controllers/comprasController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearCompra',crearCompra);

router.get('/obtenerCompras',obtenerCompras)

module.exports = router;