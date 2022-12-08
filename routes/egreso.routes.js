const{ Router }= require('express');
const {egresoGet,crearEgreso, egresoById, egresoActualizar, borrarEgreso}=require('../controllers/egresoController');
const {check} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/egresos',egresoGet);

router.get('/egreso/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    validarCampos
], egresoById);



router.post('/crear/ingreso',[
    check('descripcionEgreso','La descripcion es obligatorio').not().isEmpty(),
    check('totalEgreso','La descripcion es obligatorio').not().isEmpty(),
    validarCampos
],crearEgreso);




router.put('/editar/ingreso/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('descripcionEgreso','La descripcion es obligatorio').not().isEmpty(),
    check('totalEgreso','La descripcion es obligatorio').not().isEmpty(),
    validarCampos
],egresoActualizar);




router.delete('/delete/ingreso/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    
],borrarEgreso)

module.exports = router;