const Categoria = require('./categoriaModel');
const Producto = require('./productoModel');
const Compra = require('./compraModel');
const Role = require('./rolModel');
const Detalle = require('./detalleVentaModel');
const Egreso = require('./egresoModel');
const Ingreso = require('./ingresoModel');
const Proveedor = require('./proveedorModel');
const Usuario = require('./usuarioModel');
const Venta = require('./ventaModel');
module.exports = {
    Compra,
    Role,
    Producto,
    Detalle,
    Egreso,
    Ingreso,
    Proveedor,
    Usuario,
    Venta,
    Categoria
}