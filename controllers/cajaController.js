const {Caja} = require('../models');
const { response, json } = require("express");

const cajaAbierta = async(req, res=response)=>{

    try {
        const {status} =  req.body
        console.log('status');
        console.log(status);
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
            await Caja.findByIdAndUpdate(infoCaja._id,{status:0},{new:true})
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

module.exports = {
    cajaAbierta,
    cantidadVecesAbiertaHoy
}