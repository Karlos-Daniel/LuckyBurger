const {response, request, json} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {googleVerify} = require('../helpers/google-verify')
const { generarJWT } = require('../helpers/generar-jwt');


const login = async(req= request, res= response)=>{
    
    try {
        const {correo,password} = req.body;
        
        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Correo no se encuentra registrado'
            })
        }
        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Estado : false'
            })
        }
        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);

            res.json({
                usuario,
                token
            })
        
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            msg: 'Error al logear'
        });
    }
}

module.exports = {
    login,
    
}