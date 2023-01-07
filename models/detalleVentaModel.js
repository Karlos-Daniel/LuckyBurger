const {Schema, model} = require('mongoose');

const detalleSchema = Schema({
    
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
    precioDetalle: {
        type: Number,
        default: 0,
        require: true
    },
    adicion:{
        type:Schema.Types.ObjectId,
        ref: 'Producto',
        default: '63b62602166e1bb0f3c25163'
    },
    venta:{
        type: Schema.Types.ObjectId,
        ref: 'Venta',
        require: true 
    }



});
detalleSchema.methods.toJSON = function(){
    const { __v, _id,...detalleSchema }=this.toObject();
    detalleSchema.uid = _id
    return detalleSchema;
}

module.exports = model('DetalleVenta',detalleSchema);