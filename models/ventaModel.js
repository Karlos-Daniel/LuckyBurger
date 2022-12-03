const {Schema, model} = require('mongoose');

const ventaSchema = Schema({
    
    cantidad:{
        type: Number,
        default: 1,
        require: true
    },
    totalVenta: {
        type: Number,
        default: 0,
        require: true
    },
    tipoPedido:{
        type: String,
        emun: ['domicilio', 'local']
    },
    fechaVenta: {
        type: Date,
        default: Date.now,
        require: true
    },
    



});
ventaSchema.methods.toJSON = function(){
    const { __v, _id,...ventaSchema }=this.toObject();
    ventaSchema.uid = _id
    return ventaSchema;
}

module.exports = model('Venta',ventaSchema);