const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({
    nombre1: {
        type: String,
        required: [true, 'El nombre es obligatorio'],

    },
    nombre2: {
        type: String,
    },
    apellido1: {
        type: String,
        required: [true, 'El nombre es obligatorio'],

    },
    apellido2: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio'],
        unique: true
    },
    direccion: {
        type: String,
        require: [true, 'La direccion es obligatoria'],
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },

    estado: {
        type: Boolean,
        default: true
    },
    imgUsuario: {
        type: String,
    },
    
});

usuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id
    return usuario;
}


module.exports = model('Usuario', usuarioSchema);

