const { response } = require("express");
const { Producto, Categoria } = require('../models');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { subirArchivo } = require('../helpers/subir-archivo');
//obtener productos - paginado - total - populate
const productosGetProducto = async (req = request, res = response) => {

    const { limite, desde } = req.query;
    const query = { estado:true,tipoProducto: "Venta" };



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
//obtener producto populate { }
const productoById = async (req, res = response) => {

    try {
        const { id } = req.params
        const existe = await Producto.findById(id);

        console.log(existe);
        if (existe.estado == false) {
            return res.json({
                msg: `El producto ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }

        const { nombreProducto, descripcionProducto, stock, precio, categoria } = await Producto.findById(id);
        const { nombreCategoria } = await Categoria.findById(categoria);

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
const productoActualizar = async (req = request, res = response) => {
    try {
        //VALIDA CREADOR
        const { id } = req.params;
        const { estado, ...data } = req.body;
        const producto = await Producto.findById(id);
        if (req.files) {
            const nombreArr = producto.imgProducto.split('/');
            const nombre = nombreArr[nombreArr.length - 1]
            const [public_id] = nombre.split('.')
            console.log(public_id);
            await cloudinary.uploader.destroy(public_id);
            const {tempFilePath} = req.files.archivo
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

            producto.imgProducto=secure_url
            await producto.save()
        }

        if (producto.estado == false) {
            return res.json({
                msg: `El producto ${id} no se encuentra en la base de datos, ha sido borrado`
            })
        }
        const productoUpdate = await Producto.findByIdAndUpdate(id, data, { new: true })

        res.json(productoUpdate)

    } catch (error) {
        console.log(error);
        res.status(401);
    }
}


//borrarproductos - estado: false
const borrarProductos = async (req, res) => {

    const { id } = req.params;
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

        const { nombreProducto,
            precio,
            categoria,
            proveedor,
            descripcionProducto,
            tipoProducto
            } = req.body;

        const productoDB = await Producto.findOne({ nombreProducto });

        if (productoDB) {
            return res.status(400).json({
                msg: `La producto ${productoDB} ya existe`
            });
        }
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
            return res.status(400).json({ msg: 'No hay archivos en la peticion.' });
            
        }

        //Generar data a guardar
        const data = {
            nombreProducto,
            precio,
            categoria,
            proveedor,
            descripcionProducto,
            tipoProducto
            //FALTA IMAGEN
        }
        const producto = new Producto(data);

        await producto.save();
        const { tempFilePath } = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        producto.imgProducto = secure_url
        await producto.save()




        res.status(201).json(producto);
    } catch (error) {
        console.log(error);
        res.status(500)

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

module.exports = {
    crearProducto,
    productosGetInventario,
    productosGetProducto,
    productoActualizar,
    borrarProductos,
    productoById
}