const{ Router }= require('express');

const {cajaAbierta,cantidadVecesAbiertaHoy,tiempoAbierta} = require('../controllers/cajaController')

const router = Router();


router.post('/status/:status',cajaAbierta)

router.post('/timeStatus/:status',tiempoAbierta)

router.get('/infoCaja',cantidadVecesAbiertaHoy)

module.exports = router