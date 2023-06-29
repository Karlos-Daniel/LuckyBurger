const { response } = require("express");
const {Inventario} = require('../models');

//obtener categorias - paginado - total - populate
const InventarioGet = async(req = request, res = response)=>{

    const {limite,desde} = req.query;
    const query = {estado: true};
    
    const resp = await Promise.all([
        
        Inventario.countDocuments(query),
         Inventario.find(query)
         .skip(desde)
         .limit(limite)
         
    ])
    resp[1] = resp[1].sort((a,b)=>{
        if (a.nombreInventario
            > b.nombreInventario) {
            return 1;
          }
          if (a.nombreInventario < b.nombreInventario) {
            return -1;
          }
          
          return 0;
    })
    
    return res.json({
                 resp
            })

}
//obtener categoria populate { }
const InventarioById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const {insumo, stock} = await Inventario.findById(id);
        
        if(!insumo || !stock) {
            return res.status(400).json({
                msg: 'no se encuentra el insumo en el inventario'
            })
        }
        return res.json({
            insumo, 
            stock
        })
    } catch (error) {
        console.log(error);
        return res.json({
            msg:`error: ${error}`
        })
    }

}
//actualizarCategoria
const InventarioActualizar = async(req = request, res = response)=>{
    try {
        //VALIDA CREADOR
        const {id} = req.params;
        const {insumo, stock} = req.body;
        const inventario = await Inventario.findById(id);
        
        
        if(!inventario){
            return res.status(400).json({
                msg: 'no se encuentra el insumo en el inventario'
            })
        }
        const data ={
            insumo,
            stock
        }
        const Inventario = await Inventario.findByIdAndUpdate(id,data,{new:true})

        return res.json(Inventario)

    } catch (error) {
        console.log(error);
        return res.status(500);
    }
 }

//borrarCategorias - estado: false
const borrarInventario = async(req,res)=>{

    const {id} = req.params;

    const existe = Inventario.findById(id)

    if(!existe){
        return res.status(400).json({
            msg:"El producto con ese id no existe"
        })
    }

    await Inventario.findByIdAndDelete(id)
    return res.json({
        msg: 'borrada con exito'
    })

}

const crearInventario = async(req,res = response)=>{

    try {
        
        const {insumo, stock} = req.body;
        const categoriaDB = await Inventario.findOne({insumo:insumo});
        // console.log(nombre);
        if(categoriaDB){
            return res.status(400).json({
                msg: `El articulo ${insumo} ya existe`
            });
        }
    
        //Generar data a guardar
        const data = {
            insumo, 
            stock
        }
        const Inventario = new Inventario(data);
        await Inventario.save();
        return res.status(201).json(Inventario);

    } catch (error) {
        console.log(error);
        res.status(500)       
    }
}

module.exports = {
    crearInventario,
    InventarioGet,
    InventarioActualizar,
    borrarInventario,
    InventarioById
}