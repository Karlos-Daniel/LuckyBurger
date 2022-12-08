const{ Router }= require('express');
const {crearCompra}=require('../controllers/comprasController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/crearCompra',crearCompra);

router.get('/obtenerCompras')

module.exports = router;