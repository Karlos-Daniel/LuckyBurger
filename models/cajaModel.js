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
    
});

cajaSchema.methods.toJSON = function(){
    const { __v, _id,...caja }=this.toObject();
    caja.uid = _id
    return caja;
}

module.exports = model('Caja',cajaSchema);