const {Schema, model} = require('mongoose');

const categoriaSchema = Schema({
    nombreCategoria:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    descripcion:{
        type: String,
        require: true
    }
});
categoriaSchema.methods.toJSON = function(){
    const { __v, _id,...categoria }=this.toObject();
    categoria.uid = _id
    return categoria;
}

module.exports = model('Categoria',categoriaSchema);