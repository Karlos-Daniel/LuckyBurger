const { response } = require("express");
const {Producto,Usuario} = require('../models');

//obtener productos - paginado - total - populate
const productosGet = async(req = request, res = response)=>{

    const {limite = "6",desde} = req.query;
    const query = {estado: true};
    


    const resp = await Promise.all([
        
        Producto.countDocuments(query),
         Producto.find(query)
         .skip(desde)
         .limit(limite).populate('categoria').populate('proveedor')
    ])
    return res.json({
                 resp
            })

}
//obtener producto populate { }
const productoById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const {estado,...producto} = await Producto.findById(id).populate('categoria').populate('proveedor');
        if(!estado==false){
            return res.json({
                msg: 'No se encuentra en la base de datos'
            })
        }
        return res.json({
            producto
        })
    } catch (error) {
        
    }

}
//actualizarproducto
const productoActualizar = async(req = request, res = response)=>{
    try {
        //VALIDA CREADOR
        const {id} = req.params;
        const {estado,...data} = req.body;
        if(!estado==false){
            return res.json({
                msg: 'No se encuentra en la base de datos'
            })
        }
        const producto = await producto.findByIdAndUpdate(id, data,{new: true})

        res.json(producto)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }


//borrarproductos - estado: false
const borrarProductos = async(req,res)=>{

    const {id} = req.params;
        await Promise.all([
        Producto.findByIdAndUpdate(id,{estado: false}),
    ])
    return res.json({
        msg: 'borrada con exito'
    })

}




const crearProducto = async(req,res = response)=>{

    try {
        
        //******GUARDAR IMAGEN DEL PRODUCTO CON Req.file.archivo***** */

        const { nombreProducto,
                precio,
                categoria,
                proveedor,
                descripcionProducto} = req.body;
    
        const productoDB = await Producto.findOne({nombreProducto});
    
        if(productoDB){
            return res.status(400).json({
                msg: `La producto ${productoDB} ya existe`
            });
        }
    
        //Generar data a guardar
        const data = {
            nombreProducto,
            precio,
            categoria,
            proveedor,
            descripcionProducto,
            //FALTA IMAGEN
        }
        const producto = new Producto(data);
    
        await producto.save();
    
        res.status(201).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500)
        
    }


}

module.exports = {
    crearProducto,
    productosGet,
    productoActualizar,
    borrarProductos,
    productoById
}