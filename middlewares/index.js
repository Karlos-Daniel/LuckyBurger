
const validarCategorias = require('../middlewares/validar-categorias');
const  validarCampos  = require('../middlewares/validar-campos');
const validarProveedor = require('../middlewares/validar-proveedor');
// const  validarJWT  = require('../middlewares/validar-jwt');
// const validaRoles = require('../middlewares/validar-rol');
const validarProductos = require('../middlewares/validar-producto');


module.exports = {
    ...validarCategorias,
    ...validarCampos,
    ...validarProveedor,
    ...validarProductos
}