const {Schema, model} = require('mongoose');

const contraCajaSchema = Schema({
    
    c1: {
        type: String,
        require: true,
    },
    c2: {
        type: String,
        require: true,
    },
    c3: {
        type: String,
        require: true,
    },
    c4: {
        type: String,
        require: true,
    }
    
});

contraCajaSchema.methods.toJSON = function(){
    const { __v, _id,...contraCaja }=this.toObject();
    contraCaja.uid = _id
    return contraCaja;
}

module.exports = model('ContraCaja',contraCajaSchema);