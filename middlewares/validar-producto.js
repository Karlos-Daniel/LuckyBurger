const {Producto} = require('../models');

const { response, request } = require("express")

const existeProductoById= async( id = '')=>{

    const existeCategoria = await Producto.findById(id)
         if(!existeCategoria){
            throw new Error(`El id ${id} no existe en la DB`);
        }
        
}

const esCreadorProducto = async( id = '')=>{
    const existeCategoria = await Producto.findById(id)
    
    
}



module.exports = {
    existeProductoById,
    esCreadorProducto
}