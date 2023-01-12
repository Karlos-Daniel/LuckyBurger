const { response } = require("express");
const {Proveedor,Usuario} = require('../models');

//obtener categorias - paginado - total - populate
const proveedorGet = async(req = request, res = response)=>{

    const {limite,desde} = req.query;
    const query = {estado: true};
    


    const resp = await Promise.all([
        
        Proveedor.countDocuments(query),
         Proveedor.find(query)
         .skip(desde)
         .limit(limite)
         
    ])
    resp[1] = resp[1].sort((a,b)=>{
        if (a.nombreProveedor
            > b.nombreProveedor) {
            return 1;
          }
          if (a.nombreProveedor < b.nombreProveedor) {
            return -1;
          }
          
          return 0;
    })
    
    return res.json({
                 resp
            })

}
//obtener categoria populate { }
const proveedorById = async(req , res = response)=>{
    
    try {
        const {id} = req.params
        const {nombreProveedor, descripcion, NIT,direccionProveedor,contacto,estado} = await Proveedor.findById(id);
        
        if(estado==false){
            return res.json({
                msg: 'no se encuentra el proveedor'
            })
        }
        return res.json({
            nombreProveedor:nombreProveedor,
            estado:estado,
            descripcion: descripcion,
            NIT: NIT,
            direccion: direccionProveedor,
            contacto: contacto,
        })
    } catch (error) {
        
    }

}
//actualizarCategoria
const proveedorActualizar = async(req = request, res = response)=>{
    try {
        //VALIDA CREADOR
        const {id} = req.params;
        const {estado, ...data} = req.body;
        const existe = await Proveedor.findById(id);
        
        
        if(existe.estado==false){
            return res.json({
                msg: 'El proveedor no se encuentra'
            })
        }
        const proveedor = await Proveedor.findByIdAndUpdate(id,data,{new:true})

        return res.json(proveedor)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
 }


//borrarCategorias - estado: false
const borrarProveedor = async(req,res)=>{

    const {id} = req.params;
    const categoriaBorrada = await Proveedor.findByIdAndDelete(id)
    return res.json({
        msg: 'borrada con exito'
    })

}

const crearProveedor = async(req,res = response)=>{

    try {
        
        const {nombreProveedor, descripcion, NIT,direccionProveedor,contacto} = req.body;
        const categoriaDB = await Proveedor.findOne({nombreProveedor});
        // console.log(nombre);
        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoria ${categoriaDB} ya existe`
            });
        }
    
        //Generar data a guardar
        const data = {
            nombreProveedor, 
            descripcion,
            NIT,
            direccionProveedor,
            contacto
        }
        const proveedor = new Proveedor(data);
    
        await proveedor.save();
    
        res.status(201).json(proveedor);

    } catch (error) {
        console.log(error);
        res.status(500)       
    }
}

module.exports = {
    crearProveedor,
    proveedorGet,
    proveedorActualizar,
    borrarProveedor,
    proveedorById
}