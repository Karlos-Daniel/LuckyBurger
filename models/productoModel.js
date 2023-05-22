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
    precio: {
        type: Number,
        default: 0,
        require: true
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    imgProducto: {
        type: String,
    },
    tipoProducto:{
        type: String,
        emun: ['Producto','Inventario']
    }
   

   
}); productoSchema.methods.toJSON = function(){
    const { __v, _id,... producto }=this.toObject();
    producto.uid = _id
    return producto;
}

module.exports = model( 'Producto',productoSchema);