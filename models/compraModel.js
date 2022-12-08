const {Schema, model} = require('mongoose');

const compraSchema = Schema({
    
    
    totalCompra: {
        type: Number,
        default: 0,
        require: true,
    },
    descripcionCompra: {
        type: String,
        require: true
    },
    fechaCompra: {
        type: Date,
        require: true
    },
    
});
compraSchema.methods.toJSON = function(){
    const { __v, _id,...compra }=this.toObject();
    compra.uid = _id
    return compra;
}

module.exports = model('Compra',compraSchema);