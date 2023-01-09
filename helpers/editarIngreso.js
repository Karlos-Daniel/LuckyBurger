const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso, Inventario } = require("../models");

const editarIngreso = async(idVenta)=>{


        let textoUnido="";
        let productosDetalle = await Detalle.find({venta:idVenta})
        

        await Promise.all(
            (productosDetalle = productosDetalle.map(async (element) => {
                let { nombreProducto } = await Producto.findById(element.producto);
               
                textoUnido += `${nombreProducto} x ${element.cantidad},`;
                
            }))
        );

        //quito la ultima "," del texto
        const textoComa = textoUnido.substring(0, textoUnido.length - 1);
        //console.log(textoComa);

        //Updateo descripcion ingreso que genere antes
        const ingreso = await Ingreso.find({venta:idVenta});
        
        await Ingreso.findByIdAndUpdate(
            ingreso[0]._id,
            {
                descripcionIngreso: textoComa,
            },
            { new: true }
        );
}

module.exports = {
    editarIngreso
}