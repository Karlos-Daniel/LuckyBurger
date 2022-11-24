const {Schema, model} = require('mongoose');

const ingresoSchema = Schema({
    
    totalIngreso:{
        type: Number,
        require: true,
        default: 1,
    },
    fechaIngreso: {
        type: Date,
        require: true
    },
    descripcionIngreso: {
        type: String,
        require: true
    },
    



});
ingresoSchema.methods.toJSON = function(){
    const { __v, _id,...ingreso}=this.toObject();
    ingreso.uid = _id
    return ingreso;
}

module.exports = model('Ingreso',ingresoSchema);