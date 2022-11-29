const { response, json } = require("express");
const {Ingreso,Usuario} = require('../models');



const ingresosGet = async(req = request, res = response)=>{

    const {limite,desde} = req.query;
    const query = {estado: true};
    


    const resp = await Promise.all([
        
        Ingreso.countDocuments(query),
        Ingreso.find(query)
         .skip(desde)
         .limit(limite)
         
    ])
    return res.json({
                 resp
            })

}

const ingresoById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const {totalIngreso,descripcionIngreso,estado} = await Ingreso.findById(id);
        
        if(estado==false){
            return res.json({
                msg: `El ingreso ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }


        return res.json({
            totalIngreso,
            descripcionIngreso
        })
    } catch (error) {
        
    }

}

const ingresoActualizar = async(req = request, res = response)=>{
    try {
        //VALIDA CREADOR
        const {id} = req.params;
        const {estado, ...data} = req.body;
        
        if(estado==false){
            return res.json({
                msg: `El ingreso ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }

        const ingreso = await Ingreso.findByIdAndUpdate(id, data,{new: true})

        res.json(ingreso)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }



const borrarIngreso = async(req,res)=>{

    const {id} = req.params;
    await Ingreso.findByIdAndUpdate(id,{estado: false},{new: true})
    return res.json({
        msg: 'borrada con exito'
    })

}




const crearIngreso = async(req,res = response)=>{

    try {
        
        const {totalIngreso,descripcionIngreso} = req.body
                    
    
        //Generar data a guardar
        const data = {
            totalIngreso,
            descripcionIngreso
        }
        const ingreso = new Ingreso(data);
    
        await ingreso.save();
    
        res.status(201).json(ingreso);
    } catch (error) {
        console.log(error);
        res.status(500)
        
    }


}

module.exports = {
    crearIngreso,
    ingresosGet,
    ingresoActualizar,
    borrarIngreso,
    ingresoById
}