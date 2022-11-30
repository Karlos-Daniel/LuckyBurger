const{ Router }= require('express');

const {check} = require('express-validator');

const { usuariosPost, usuariosPut,usuariosDelete } = require('../controllers/usuarioController');

const {emailExiste,existeUsuarioById} = require('../helpers/db-validator')
const {validarCampos} = require('../middlewares');

const router = Router();

const errores = [
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('nombre1','El nombre1 es obligatorio').not().isEmpty(),
    check('password','El nombre1 es obligatorio').not().isEmpty(),
    check('password','Tiene que ser mas de 6 letras').isLength({min: 8}),
    validarCampos
]
//Obtener usuario

//Agregar Usuario
router.post('/crear/usuario',errores,usuariosPost);

//Borrar usuario por ID
router.delete('/borrar/usuario/:id',[
    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
],usuariosDelete);

//Actualizar  usuario por ID
router.put('/editar/usuario/:id',[

    check('id','No es un ID valido de MongoDB').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos,
],usuariosPut)


module.exports = router;