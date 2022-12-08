const{ Router }= require('express');
const {crearCompra, crearCompra2}=require('../controllers/comprasController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearCompra',crearCompra2);

router.get('/obtenerCompras')

module.exports = router;