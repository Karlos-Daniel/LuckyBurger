const {Schema, model} = require('mongoose');

const compraSchema = Schema({
    
    producto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        require: true
    },
    cantidad:{
        type: Number,
        default: 1,
        require: true
    },
    precioCompra: {
        type: Number,
        default: 0,
        require: true
    },
    proveedor:{
        type:Schema.Types.ObjectId,
        ref: 'Proveedor',
        default: '638d60f1cf8c1c4691c64ea4'
    },
    compra:{
        type: Schema.Types.ObjectId,
        ref: 'Venta',
        require: true 
    }



});
compraSchema.methods.toJSON = function(){
    const { __v, _id,...compra}=this.toObject();
    compra.uid = _id
    return compra;
}
module.exports = model('DetalleCompra',compraSchema);