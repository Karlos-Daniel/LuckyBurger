const {Schema, model} = require('mongoose');

const egresoSchema = Schema({
    
    totalEgreso:{
        type: Number,
        require: true,
        default: 1,
    },
    fechaEgreso: {
        type: Date,
        require: true
    },
    descripcionEgreso: {
        type: String,
        require: true
    },
    



});
egresoSchema.methods.toJSON = function(){
    const { __v, _id,...egreso }=this.toObject();
    egreso.uid = _id
    return egreso;
}

module.exports = model('Egreso',egresoSchema);