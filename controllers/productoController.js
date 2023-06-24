const { response } = require("express");
const { Producto, Categoria } = require('../models');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { subirArchivo } = require('../helpers/subir-archivo');
//obtener productos - paginado - total - populate
const productosGetProducto = async (req = request, res = response) => {

    const { limite, desde } = req.query;
    const query = { estado:true};



    const resp = await Promise.all([

        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite).populate('categoria', 'nombreCategoria')
    ])
    resp[1] = resp[1].sort((a,b)=>{
        if (a.nombreProducto
            > b.nombreProducto) {
            return 1;
          }
          if (a.nombreProducto < b.nombreProducto) {
            return -1;
          }
          
          return 0;
    })
    //console.log(arrOrdenado);
    return res.json({
        resp
    })

}
//obtener producto populate { }
const productoById = async (req, res = response) => {

    try {
        const { id } = req.params
        const { nombreProducto, descripcionProducto, precio, categoria } = await Producto.findById(id);

        if (!nombreProducto ||!descripcionProducto || !categoria || !precio) {
            return res.json({
                msg: `El producto ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }

        const { nombreCategoria } = await Categoria.findById(categoria);

        return res.status(200).json({
            nombreProducto,
            descripcionProducto,
            stock,
            precio,
            nombreCategoria
        })
    } catch (error) {
        console.log(error);
        return res.status(500)
    }

}
//actualizarproducto
const productoActualizar = async (req = request, res = response) => {
    try {
        //VALIDA CREADOR
        const { id } = req.params;
        const {nombreProducto,
            precio,
            categoria,
            proveedor,
            descripcionProducto,
            } = req.body;
        
        const productoDB = await Producto.findById(id);
        if (productoDB) {
            return res.status(400).json({
                msg: `La producto ${productoDB} ya existe`
            });
        }
        // if (req.files) {
        //     const nombreArr = producto.imgProducto.split('/');
        //     const nombre = nombreArr[nombreArr.length - 1]
        //     const [public_id] = nombre.split('.')
        //     console.log(public_id);
        //     await cloudinary.uploader.destroy(public_id);
        //     const {tempFilePath} = req.files.archivo
        //     const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

        //     producto.imgProducto=secure_url
        //     await producto.save()
        // }

        const data = {
            nombreProducto,
            precio,
            categoria,
            proveedor,
            descripcionProducto,
            //FALTA IMAGEN
        }

       const productoUpdate = await Producto.findByIdAndUpdate(id, data, { new: true })

        return res.status(200).json(productoUpdate)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
}


//borrarproductos - estado: false
const borrarProductos = async (req, res) => {

    const { id } = req.params;

    const existe = Producto.findById(id)

    if(!existe){
        return res.status(400).json({
            msg:"El producto con ese id no existe"
        })
    }

    await Promise.all([
        Producto.findByIdAndDelete(id)
    ])
    return res.json({
        msg: 'borrada con exito'
    })

}

const crearProducto = async (req, res = response) => {

    try {
        //******GUARDAR IMAGEN DEL PRODUCTO CON Req.file.archivo***** */

        const {nombreProducto,
            precio,
            categoria,
            proveedor,
            descripcionProducto,
            } = req.body;

        const productoDB = await Producto.findOne({ nombreProducto });

        if (productoDB) {
            return res.status(400).json({
                msg: `La producto ${productoDB} ya existe`
            });
        }
        // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        //     return res.status(400).json({ msg: 'No hay archivos en la peticion.' });
            
        // }

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

        // await producto.save();
        // const { tempFilePath } = req.files.archivo
        // const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        // producto.imgProducto = secure_url
        
        await producto.save()



        res.status(201).json(producto);
    } catch (error) {
        console.log(error);
        return res.status(500)

    }


}

const productosGetInventario = async (req = request, res = response) => {

    const { limite, desde } = req.query;
    const query = { estado:true,tipoProducto: "Inventario" };



    const resp = await Promise.all([

        Producto.countDocuments(query),
        Producto.find(query)
            .skip(desde)
            .limit(limite).populate('categoria', 'nombreCategoria')
    ])

    return res.json({
        resp
    })

}

const productosByAdiciones = async (req = request, res = response) => {
    const adiciones = await Producto.find({categoria:"6495f7655b1fb21efd4132be"})

    const filtrado = adiciones.filter(e=>!(e.nombreProducto=="SIN ADICION"))
    
    return res.json(filtrado)
}

module.exports = {
    crearProducto,
    productosGetInventario,
    productosGetProducto,
    productoActualizar,
    borrarProductos,
    productosByAdiciones,
    productoById
}