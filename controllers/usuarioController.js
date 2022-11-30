const{response,request}= require('express');
const Usuario = require('../models/usuario'); 
const brcryptjs = require('bcryptjs');
const { Proveedor } = require('../models');


// const usuariosGet = async(req = request, res = response)=>{

//     const {limite = "6",desde} = req.query;
//     const query = {estado: true};

//     const resp = await Promise.all([
//         Usuario.countDocuments(query),
//         Usuario.find(query)
//         .skip(desde)
//         .limit(limite)
//     ]);

//    return res.json({
//         resp
//    });
// }
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
        const usuarioExiste = await Proveedor.findById(id);
        const {nombre1,
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

        const usuarioDB = await Usuario.findByIdAndUpdate(id, data);

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
       
    //Convertimos el estado del usuario en false
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});


   res.json({
        usuario,
        usuarioAuth
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