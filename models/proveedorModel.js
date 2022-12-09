const {Schema, model} = require('mongoose');

const proveedorSchema = Schema({
    nombreProveedor:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    descripcion:{
        type: String,
        require: true
    },
    NIT:{
        type: String,
        require: true
    },
    direccionProveedor:{
        type: String,
        require: true
    },
    contacto:{
        type: String,
        require: true
    },
    estado:{
        type: Boolean,
        default: true,
        require:true
    },
});
proveedorSchema.methods.toJSON = function(){
    const { __v, _id,...proveedor }=this.toObject();
    proveedor.uidProveedor = _id
    return proveedor;
}

module.exports = model('Proveedor',proveedorSchema);