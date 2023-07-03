const{ Router }= require('express');

const {cajaAbierta,cantidadVecesAbiertaHoy} = require('../controllers/cajaController')

const router = Router();


router.post('/status/:status',cajaAbierta)

router.get('/infoCaja',cantidadVecesAbiertaHoy)

module.exports = router