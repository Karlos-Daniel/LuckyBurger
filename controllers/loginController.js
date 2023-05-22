const {response, request, json} = require('express');
const {Usuario} = require('../models');
const {generarJWT} = require('../helpers/generar-jwt')
const bcryptjs = require('bcryptjs');



const login = async(req= request, res= response)=>{
    
    try {
        //Solicita informacion del body y desestructura correo y password
        const {correo,password} = req.body;
        
        
        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo:correo})

        //Si no encuentra un usuario con ese correo manda error 400
        if(!usuario){
            return res.status(400).json({
                msg: 'Correo o contraseña incorrecta'
            })
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Contraseña incorrecta o correo incorrecto'
            })
        }
        //Generamos JsonWebToken
        const token = await generarJWT(correo);

            //Retornamos el usuario con su token
            return res.json({
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