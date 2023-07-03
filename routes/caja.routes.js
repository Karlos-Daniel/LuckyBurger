const{ Router }= require('express');

const {cajaAbierta,cantidadVecesAbiertaHoy,tiempoAbierta,cambiarContraCaja,
    getContraCaja} = require('../controllers/cajaController')

const router = Router();


router.post('/status/:status',cajaAbierta)

router.post('/timeStatus/:status',tiempoAbierta)

router.get('/infoCaja',cantidadVecesAbiertaHoy)


router.put('/contra',cambiarContraCaja)

router.get('/contra',getContraCaja)

module.exports = router