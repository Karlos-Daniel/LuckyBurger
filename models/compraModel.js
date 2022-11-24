const {Schema, model} = require('mongoose');

const compraSchema = Schema({
    
    cantidad:{
        type: Number,
        default: 1,
        require: true,
    },
    totalCompra: {
        type: Number,
        default: 0,
        require: true,
    },
    descripcionEgreso: {
        type: String,
        require: true
    },
    fechaCompra: {
        type: Date,
        require: true
    },
    proveedor:{
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        require: true
    },
    producto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        require: true
    },



});
compraSchema.methods.toJSON = function(){
    const { __v, _id,...compra }=this.toObject();
    compra.uid = _id
    return compra;
}

module.exports = model('Compra',compraSchema);