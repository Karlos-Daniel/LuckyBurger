const { response, json } = require("express");
const {Egreso} = require('../models');



const egresoGet = async(req = request, res = response)=>{

    const {limite,desde} = req.query;
    const query = {estado: true};
    


    const resp = await Promise.all([
        
        Egreso.countDocuments(query),
        Egreso.find(query)
         .skip(desde)
         .limit(limite)
         
    ])
    return res.json({
                 resp
            })

}

const crearEgreso = async(req,res=response)=>{
    const {descripcionEgreso, totalEgreso} = req.body
    const data = {
        descripcionEgreso,
        totalEgreso
    }
    const egreso = new Egreso(data);
    
        await egreso.save();
    return res.json({msg:'egreso creado con exito'})
}

const borrarEgreso = async(req,res)=>{

    const {id} = req.params;
    await Egreso.findByIdAndUpdate(id,{estado: false},{new: true})
    return res.json({
        msg: 'borrada con exito'
    })

}

const egresoActualizar = async(req = request, res = response)=>{
    try {
        //VALIDA CREADOR
        const {id} = req.params;
        const {estado, ...data} = req.body;
        const existe = await Egreso.findById(id);
        
        
        if(existe.estado==false){
            return res.json({
                msg: `El ingreso ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }
        

        const egreso = await Egreso.findByIdAndUpdate(id, data,{new: true})

        res.json(egreso)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }

 const egresoById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const {totalEgreso,descripcionEgreso,estado} = await Egreso.findById(id);
        
        if(estado==false){
            return res.json({
                msg: `El ingreso ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }


        return res.json({
            totalEgreso,
            descripcionEgreso
        })
    } catch (error) {
        
    }

}

module.exports = {
    egresoGet,
    borrarEgreso,
    egresoById,
    egresoActualizar,
    crearEgreso

}