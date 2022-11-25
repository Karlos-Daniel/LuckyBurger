const {Categoria, Usuario} = require('../models');

const { response, request } = require("express")

const existeCategoriaById= async( id = '')=>{

    const existeCategoria = await Categoria.findById(id)
         if(!existeCategoria){
            throw new Error(`El id ${id} no existe en la DB`);
        }
        
}

const esCreadorCategoria = async( id = '')=>{
    const existeCategoria = await Categoria.findById(id)
    
    
}



module.exports = {
    existeCategoriaById,
    esCreadorCategoria
}