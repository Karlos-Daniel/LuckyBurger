const { response, json } = require("express");
const {Categoria,Usuario} = require('../models');
const { exists } = require("../models/categoriaModel");

//obtener categorias - paginado - total - populate
const categoriasGet = async(req = request, res = response)=>{

    const {limite,desde} = req.query;
    const query = {estado: true};
  
    const resp = await Promise.all([
        
        Categoria.countDocuments(query),
         Categoria.find(query)
         .skip(desde)
         .limit(limite)
         
    ])
    resp[1] = resp[1].sort((a,b)=>{
        if (a.nombreCategoria
            > b.nombreCategoria) {
            return 1;
          }
          if (a.nombreCategoria < b.nombreCategoria) {
            return -1;
          }
          
          return 0;
    })
    return res.json({
                 resp
            })

}
//obtener categoria populate { }
const categoriaById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const {nombreCategoria, estado, descripcion} = await Categoria.findById(id);
        if(!estado){
            return json({
                msg: 'no se encuentra la categoria'
            })
        }
        return res.json({
            nombreCategoria:nombreCategoria,
            descripcion: descripcion
        })
    } catch (error) {
        
    }

}
//actualizarCategoria
const categoriaActualizar = async(req = request, res = response)=>{
    try {
        //VALIDA CREADOR
        const {id} = req.params;
        const {estado, ...data} = req.body;

        data.nombreCategoria = data.nombreCategoria.toUpperCase();
        
        const categoria = await Categoria.findByIdAndUpdate(id, data,{new: true})

        res.json(categoria)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }


//borrarCategorias - estado: false
const borrarCategorias = async(req,res)=>{

    const {id} = req.params;

    const existe = await Categoria.findById(id)

    if(!existe){
        return res.status(400).json({
            msg:'La categoria no existe en la DB'
        })
    }

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id,{estado: false},{new: true})
    return res.json({
        msg: 'borrada con exito'
    })

}




const crearCategoria = async(req,res = response)=>{

    try {
        
        const nombreCategoria = req.body.nombreCategoria.toUpperCase();
        const descripcion = req.body.descripcion
        const categoriaDB = await Categoria.findOne({nombreCategoria});
        // console.log(nombre);
        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoria ${categoriaDB} ya existe`
            });
        }
    
        //Generar data a guardar
        const data = {
            nombreCategoria,
            descripcion
        }
        const categoria = new Categoria(data);
    
        await categoria.save();
    
        res.status(201).json(categoria);
    } catch (error) {
        console.log(error);
        res.status(500)
        
    }


}

module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaActualizar,
    borrarCategorias,
    categoriaById
}