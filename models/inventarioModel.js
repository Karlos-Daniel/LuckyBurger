const {Schema, model} = require('mongoose');

const inventarioSchema = Schema({
    producto:{
        type: Schema.Types.ObjectId,
        ref:'Producto'
    },
    stock:{
        type: Number,
        require: true,
        default: 0,
    },
    estado:{
        type: Boolean,
        default: true,
    },
    
   

   
}); inventarioSchema.methods.toJSON = function(){
    const { __v, _id,... inventario }=this.toObject();
    inventario.uid = _id
    return inventario;
}

module.exports = model( 'Inventario',inventarioSchema);