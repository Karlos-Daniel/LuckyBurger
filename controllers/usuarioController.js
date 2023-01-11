const{response,request}= require('express');
const Usuario = require('../models/usuarioModel')
const brcryptjs = require('bcryptjs');


const usuariosPost = async(req = request, res = response)=>{
    try {
        
      const {nombre1,
            nombre2,
            apellido1,
            apellido2,
            correo,
            direccion,
            password} = req.body;

        const data ={
            nombre1,
            nombre2,
            apellido1,
            apellido2,
            correo,
            direccion,
            password
        }
            
        const usuario = new Usuario(data);
       
        //Encriptar contraseña
         const salt =  brcryptjs.genSaltSync();
         usuario.password = brcryptjs.hashSync(password,salt);

        //Guardar en DB
        await usuario.save();
        res.json({
            usuario
        });

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }
 const usuariosPut = async(req = request, res = response)=>{
    try {
        
        const {id} = req.params;
        const {estado,nombre1} = await Usuario.findById(id);
        
        if(estado==false){
            return res.json({
                msg: `El usuario${nombre1} ha sido borrado previamente`
            })
        }
        const {
            nombre2,
            apellido1,
            apellido2,
            correo,
            direccion,
            password} = req.body

            const data ={
                nombre1,
                nombre2,
                apellido1,
                apellido2,
                correo,
                direccion,
                password
            }
            
       
            //Encriptar contraseña
             const salt =  brcryptjs.genSaltSync();
             data.password = brcryptjs.hashSync(password,salt);
        const usuarioDB = await Usuario.findByIdAndUpdate(id, data);
            console.log(data);
        res.json({
            msg: 'Ha sido cambiado con exito',
            data
        })

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }

 const usuariosDelete = async(req = request, res = response)=>{
try {
    
    const {id}= req.params;
     const existe = await Usuario.findById(id)
     if(!existe){
        return res.status(400).json({
            msg:'El usuario no existe en la db'
        })
     }  
    //Convertimos el estado del usuario en false
    const usuario = await Usuario.findByIdAndDelete(id);


  return res.json({
        msg: 'usuario borrado con exito'
   })
} catch (error) {
    console.log(error);
}
}



module.exports = {
    usuariosPut,
    usuariosDelete,
    usuariosPost
}