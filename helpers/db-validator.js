

const Usuario = require('../models/usuarioModel');

const emailExiste= async(correo = '')=>{

    const existeEmail = await Usuario.findOne({correo});
         if(existeEmail){
            throw new Error(`El email ${correo} ya se encuentra registrado`);
        }
}
const existeUsuarioById= async( id = '')=>{

    const existeUsuario = await Usuario.findById(id)
         if(!existeUsuario){
            throw new Error(`El id ${id} no existe en la DB`);
        }
}


module.exports = {
    existeUsuarioById,
    emailExiste
}


