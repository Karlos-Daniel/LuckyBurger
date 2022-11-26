const {Schema, model} = require('mongoose');

const ingresoSchema = Schema({
    
    totalIngreso:{
        type: Number,
        require: true,
    },
    fechaIngreso: {
        type: Date,
        require: true,
        default: Date.now
    },
    descripcionIngreso: {
        type: String,
        require: true
    },estado:{
        type: Boolean,
        default: true,
        require:true
    },

    



});
ingresoSchema.methods.toJSON = function(){
    const { __v, _id,...ingreso}=this.toObject();
    ingreso.uid = _id
    return ingreso;
}

module.exports = model('Ingreso',ingresoSchema);