const {Proveedor, Usuario} = require('../models');

const { response, request } = require("express")

const existeProveedorById= async( id = '')=>{

    const existeProveedor = await Proveedor.findById(id)
    
         if(!existeProveedor){
            throw new Error(`El id ${id} no existe en la DB`);
        }
        
}


module.exports = {
    existeProveedorById,
}