const {Schema, model} = require('mongoose');

const productoSchema = Schema({
    nombreProducto:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    
    descripcionProducto:{
        type: String,
        require: true
    },
    stock:{
        type: Number,
        default: 0,
    },
    precio: {
        type: Number,
        default: 0,
        require: true
    },
    imgProducto: {
        type: String,
    },
    estado:{
        type: Boolean,
        default: true,
        require:true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    proveedor:{
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        require: true
    },

    descripcion:{type: String},
    disponible:{type: Boolean, default: true}
}); productoSchema.methods.toJSON = function(){
    const { __v, _id,... producto }=this.toObject();
    return producto;
}

module.exports = model( 'Producto',productoSchema);