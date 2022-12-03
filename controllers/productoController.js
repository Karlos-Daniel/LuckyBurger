const { response } = require("express");
const {Producto,Categoria} = require('../models');

//obtener productos - paginado - total - populate
const productosGet = async(req = request, res = response)=>{

    const {limite,desde} = req.query;
    const query = {estado: true};
    


    const resp = await Promise.all([
        
        Producto.countDocuments(query),
         Producto.find(query)
         .skip(desde)
         .limit(limite).populate('categoria','nombreCategoria')
    ])
    
    return res.json({
                 resp
            })

}
//obtener producto populate { }
const productoById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const existe = await Producto.findById(id);
        
        
        if(existe.estado==false){
            return res.json({
                msg: `El producto ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }
        const {nombreProducto,descripcionProducto,stock,precio,categoria} = await Producto.findById(id);
        const {nombreCategoria} = await Categoria.findById(categoria);
        
        return res.json({
            nombreProducto,
            descripcionProducto,
            stock,
            precio,
            nombreCategoria
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
        const existe = await Producto.findById(id);
        
        
        if(existe.estado==false){
            return res.json({
                msg: `El producto ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }
        const producto = await Producto.findByIdAndUpdate(id, data,{new: true})

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
        console.log(producto);
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