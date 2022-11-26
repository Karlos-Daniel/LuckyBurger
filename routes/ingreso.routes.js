const{ Router }= require('express');

const {check} = require('express-validator');
const { crearIngreso,ingresosGet,ingresoActualizar,borrarIngreso,ingresoById } = require('../controllers/ingresosController');
const {validarCampos} = require('../middlewares');

const router = Router();


router.get('/ingresos',ingresosGet);



router.get('/ingreso/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    validarCampos
], ingresoById);



router.post('/crear/ingreso',[
    check('descripcion','La descripcion es obligatorio').not().isEmpty(),
    check('totalIngreso','La descripcion es obligatorio').not().isEmpty(),
    validarCampos
],crearIngreso);




router.put('/editar/ingreso/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('descripcion','La descripcion es obligatorio').not().isEmpty(),
    check('totalIngreso','La descripcion es obligatorio').not().isEmpty(),
    validarCampos
],ingresoActualizar);




router.delete('/delete/ingreso/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    
],borrarIngreso)



module.exports = router

