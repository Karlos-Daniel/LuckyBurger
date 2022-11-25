const{ Router }= require('express');

const {check} = require('express-validator');
const { crearCategoria, categoriaById,categoriasGet, categoriaActualizar, borrarCategorias } = require('../controllers/categoriasController');
const {validarCampos, existeCategoriaById } = require('../middlewares');

const router = Router();

//Obtener todas las categorias - publico
router.get('/categorias',categoriasGet);//LISTO



//Obtener una categoria por id - publico
router.get('/categoria/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
], categoriaById );//LISTO
//VALIDAR ID


//Crear categoria - privado - cualquier persona con un token valido
router.post('/crear/categorias',[
    check('nombreCategoria','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);



//Editar categoria - privado - cualquier persona con un token valido
router.put('/editar/categorias/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeCategoriaById ),
    check('nombreCategoria','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],categoriaActualizar);
//VALIDAR ID


//  Borrar una categoria - privado - cualquier persona con un token valido
//  PASAR DE ESTADO A FALSE NO BORRAR COMO TAL FISICAMENTE
router.delete('/delete/categorias/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeCategoriaById ),
],borrarCategorias)
//VALIDAR ID


module.exports = router

