const{ Router }= require('express');

const {check} = require('express-validator');
const { crearProveedor,proveedorGet,proveedorActualizar,borrarProveedor,proveedorById } = require('../controllers/proveedoresController');
const {validarCampos, existeProveedorById } = require('../middlewares');

const router = Router();


router.get('/proveedores',proveedorGet);



router.get('/proveedor/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeProveedorById ),
    validarCampos
], proveedorById );



router.post('/crear/proveedores',[
    check('nombreProveedor','El nombreProveedor es obligatorio').not().isEmpty(),
    validarCampos
],crearProveedor);




router.put('/editar/proveedores/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeProveedorById ),
    check('nombreProveedor','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],proveedorActualizar);




router.delete('/delete/proveedor/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeProveedorById ),
],borrarProveedor)



module.exports = router

