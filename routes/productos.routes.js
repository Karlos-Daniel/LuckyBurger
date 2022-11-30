const{ Router }= require('express');

const {check} = require('express-validator');
const { crearProducto,productoById,productosGet, productoActualizar, borrarProductos } = require('../controllers/productoController');
const {validarCampos,existeCategoriaById,existeProductoById } = require('../middlewares');

const router = Router();

//Obtener todas las Productos - publico
router.get('/productos',productosGet);//LISTO



//Obtener una Producto por id - publico
router.get('/producto/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeProductoById ),
    validarCampos
], productoById );//LISTO
//VALIDAR ID


//Crear Producto - privado - cualquier persona con un token valido
router.post('/crear/productos',[
    check('nombreProducto','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un ID de Mongo en la categoria').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
],crearProducto);



//Editar Producto - privado - cualquier persona con un token valido
router.put('/editar/productos/:id',[
    check('id').custom( existeProductoById ),
    validarCampos
],productoActualizar);
//VALIDAR ID


//  Borrar una Producto - privado - cualquier persona con un token valido
//  PASAR DE ESTADO A FALSE NO BORRAR COMO TAL FISICAMENTE
router.delete('/delete/productos/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeProductoById ),
],borrarProductos)
//VALIDAR ID


module.exports = router
