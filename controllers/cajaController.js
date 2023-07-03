const {Caja,ContraCaja} = require('../models');
const { response, json } = require("express");

const cajaAbierta = async(req, res=response)=>{

    try {
        const {status} =  req.params
        const body = req.body
        console.log('status');
        console.log(status);
        console.log('Body');
        console.log(body);
        const dia = new Date().getDate();
        const mes = new Date().getMonth();
        const year = new Date().getFullYear();
        const fechaActual = `${dia}/${mes}/${year}`;
    
        const infoCaja = await Caja.findOne({fechaCaja:fechaActual})
        console.log(infoCaja);
    
        if(status==1 || status =='1' || status===1 || status==='1'){
            if(!infoCaja) {
                const cajaData ={
                    fechaCaja:fechaActual,
                    vecesAbierta:1,
                    status:1
                }
                const cajaNueva = new Caja(cajaData)
                await cajaNueva.save();
                return res.status(200).json({
                    msg: 1
                })
            }else{
                console.log('aqui');
                console.log(infoCaja);
                const cantidad = infoCaja.vecesAbierta + 1
                await Caja.findByIdAndUpdate(infoCaja._id,{vecesAbierta:cantidad,status:1},{new:true})
                return res.status(200).json({
                    msg:cantidad
                })
            }
        }else{
            await Caja.findByIdAndUpdate(infoCaja._id,{status:0,muchoTiempo:false},{new:true})
            return res.status(200).json({
                msg:'Caja cerrada'
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }
  
}

const tiempoAbierta = async(req,res=response)=>{

    try {
        const {status} = req.params

        const dia = new Date().getDate();
        const mes = new Date().getMonth();
        const year = new Date().getFullYear();
        const fechaActual = `${dia}/${mes}/${year}`;
    
        const infoCaja = await Caja.findOne({fechaCaja:fechaActual})
        if(infoCaja && status==1 || status=='1'){
    
            await Caja.findByIdAndUpdate(infoCaja._id,{muchoTiempo:true},{new:true})
            const newInfo = await Caja.findOne({fechaCaja:fechaActual})
            return res.status(200).json(newInfo)
        }else{
            await Caja.findByIdAndUpdate(infoCaja._id,{muchoTiempo:false},{new:true})
            const newInfo = await Caja.findOne({fechaCaja:fechaActual})
            return res.status(200).json(newInfo)
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:error})
    }

   


}

const cantidadVecesAbiertaHoy = async(req, res=response)=>{

    try {
    const dia = new Date().getDate();
    const mes = new Date().getMonth();
    const year = new Date().getFullYear();
    const fechaActual = `${dia}/${mes}/${year}`;

    const infoCaja = await Caja.findOne({fechaCaja:fechaActual})

    return res.status(200).json(infoCaja)

        
    


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error
        })
    }
    
}

const cambiarContraCaja = async(req,res=response)=>{

    try {
        const {c1,c2,c3,c4} = req.body
    const id = "64a308a95cd361a332dda682"

    await ContraCaja.findByIdAndUpdate(id,{c1:c1,c2:c2,c3:c3,c4:c4},{new:true})

    return res.status(200).json({
        msg:'contraseña actualizada'
    })

    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}

const getContraCaja = async(req,res=response)=>{
    try {
        const id = "64a308a95cd361a332dda682"

        const contra = await ContraCaja.findById(id)

        return res.status(200).json(contra)
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
}



module.exports = {
    cajaAbierta,
    tiempoAbierta,
    cambiarContraCaja,
    getContraCaja,
    cantidadVecesAbiertaHoy
}