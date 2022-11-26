const {Schema, model} = require('mongoose');

const egresoSchema = Schema({
    
    totalEgreso:{
        type: Number,
        require: true,
    },
    fechaEgreso: {
        type: Date,
        require: true,
        default: Date.now
    },
    descripcionEgreso: {
        type: String,
        require: true
    },estado:{
        type: Boolean,
        default: true,
        require:true
    },
    
});
egresoSchema.methods.toJSON = function(){
    const { __v, _id,...egreso }=this.toObject();
    egreso.uid = _id
    return egreso;
}

module.exports = model('Egreso',egresoSchema);