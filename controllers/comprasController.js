//PARA HACER
const { response, text } = require("express");
const { stringify } = require("uuid");
const { Proveedor,DetalleCompra,Egreso,Compra,Producto,Inventario } = require('../models');
const { findByIdAndUpdate } = require("../models/categoriaModel");



const crearCompra = async(req,res=response)=>{
    
    try {
    const compra= req.body
    //console.log(compra);
    
    //console.log(compra.compra[1]);
    //Saco el total del pedido    
    const totalCompra = compra.compra[0].totalCompra
    
   
    

    //hago la data para la tabla Compra
    const dataCompra = {
        totalCompra:totalCompra
    }
    //Genero una nueva fila para la tabla Venta con la informacion de dataVenta
    const compraModel = new Compra(dataCompra);
    //Lo guardo en la DB
    await compraModel.save()

    const IdCompra = compraModel._id
    
    //Seteo la data de la tabla Ingreso
    const dataEgreso ={
        totalEgreso:totalCompra,  
        compra: IdCompra
    }

    //Genero la nueva fila para Ingreso
    const egresoModel = new Egreso(dataEgreso)
    //Guardo en la DB
    await egresoModel.save()

    //Saco el Id del ingreso y lo declaro como constante

    const idEgreso = egresoModel._id

    //Saco el Id de venta y lo declaro como constante
    
    compra.compra.shift()
    //console.log(compra.compra);
    //Mapeo el pedido para poder añadirle venta: idVenta a cada detalleVenta
    compra.compra=compra.compra.map(element=>{
        return {...element,compra:IdCompra}  
    });
    let arr = []
    
    
    let textoUnido = ''
    //por cada elemento lo guardo en detalleVentas
    await Promise.all(compra.compra.map(async(element) => {
        console.log(element);
        let detalleCompra = new DetalleCompra(element)
        await detalleCompra.save()

        let {insumo} = await Inventario.findById(element.producto)

        textoUnido += `| ${insumo} x ${element.cantidad} |`;
        console.log(insumo);
    }))
    console.log(textoUnido);
    
    await Egreso.findByIdAndUpdate(idEgreso,{
        descripcionEgreso:textoUnido
    },{new:true})
    //Updateo descripcion ingreso que genere antes
     await Compra.findByIdAndUpdate(IdCompra,{
        descripcionCompra:textoUnido
    },{new:true})
     
   return res.json({
    msg: "Compra Ingresado correctamente"
   })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'algo salio mal en el Backend'
        })
    }

    
}

const obtenerCompras = async(req,res=response)=>{

    const resp = await Compra.find({})


    return res.json(resp)

}



module.exports = {
    
    crearCompra,
    obtenerCompras
}



