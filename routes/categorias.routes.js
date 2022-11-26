const{ Router }= require('express');

const {check} = require('express-validator');
const { crearCategoria, categoriaById,categoriasGet, categoriaActualizar, borrarCategorias } = require('../controllers/categoriasController');
const {validarCampos, existeCategoriaById } = require('../middlewares');

const router = Router();


router.get('/categorias',categoriasGet);



router.get('/categoria/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeCategoriaById ),
    validarCampos
], categoriaById );



router.post('/crear/categorias',[
    check('nombreCategoria','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria);




router.put('/editar/categorias/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeCategoriaById ),
    check('nombreCategoria','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],categoriaActualizar);




router.delete('/delete/categorias/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom( existeCategoriaById ),
],borrarCategorias)



module.exports = router

