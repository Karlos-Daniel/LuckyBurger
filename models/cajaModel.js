const {Schema, model} = require('mongoose');

const cajaSchema = Schema({
    
    fechaCaja: {
        type: String,
        require: true,
    },
    vecesAbierta:{
        type: Number,
        require: true,
    },
    status:{
        type:Boolean,
        require: true
    },
    muchoTiempo:{
        type:Boolean,
        default:false,
        require: true
    }
    
});

cajaSchema.methods.toJSON = function(){
    const { __v, _id,...caja }=this.toObject();
    caja.uid = _id
    return caja;
}

module.exports = model('Caja',cajaSchema);