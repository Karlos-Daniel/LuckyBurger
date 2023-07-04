const{ Router }= require('express');

const {check} = require('express-validator');
const {crearInventario,
    InventarioGet,
    InventarioActualizar,
    borrarInventario,
    InventarioById} = require('../controllers/inventariosController');
const {validarCampos} = require('../middlewares');

const router = Router();


router.get('/inventarios',InventarioGet);

router.get('/inventario/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    validarCampos
], InventarioById );

router.post('/crear/inventarios',[
    check('insumo','El insumo es obligatorio').not().isEmpty(),
    validarCampos
],crearInventario);

router.put('/editar/inventarios/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('insumo','El insumo es obligatorio').not().isEmpty(),
    check('stock','El insumo es obligatorio').not().isEmpty(),
    validarCampos
],InventarioActualizar);

router.delete('/delete/inventarios/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
],borrarInventario)



module.exports = router

