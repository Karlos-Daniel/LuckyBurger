const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso, Inventario } = require("../models");
const { editarIngreso } = require('../helpers/editarIngreso')
const { find, findByIdAndUpdate } = require("../models/categoriaModel");


const crearPedido = async (req, res = response) => {
    try {
        const { pedido } = req.body;

        // Sacamos datos para venta
        const totalVenta = pedido[0].totalpedido
        const tipoPedido = pedido[0].tipoPedido
        const mesa = pedido[0].mesa

        //data para venta
        const dataVenta = {
            totalVenta,
            tipoPedido,
            mesa
        }
        const venta = new Venta(dataVenta)
        await venta.save()

        //Porcedemos a organizar los datos para la tabla
        // detalleVenta
        const idVenta = venta._id

        pedido.shift()

        //console.log(pedidos);
        //Llenamos la tabla detalleVenta con un forEach
        let descripcionVenta = ""; // Inicializamos la variable fuera del bucle

        await Promise.all(pedido.map(async (e) => {
            let { nombreProducto } = await Producto.findById(e.producto);
            descripcionVenta += `| ${nombreProducto} x ${e.cantidad} |`;
            let descripcionFinal = "";
            let descripcion = e.descripcion.join(", ");
            let adiciones = e.adiciones.join(", ");

            if (descripcion.length > 0 && adiciones.length > 0) {
                descripcionFinal = `${descripcion} y ${adiciones}`;
            } else {
                if (descripcion.length > 0) {
                    descripcionFinal = `${descripcion}`
                } else {
                    if (adiciones.length > 0) {
                        descripcionFinal = `${adiciones}`
                    }
                    else {
                        descripcionFinal = 'Sin adición'
                    }
                }
            }
            console.log(descripcionFinal);

            let detalleVenta = {
                venta: idVenta,
                producto: e.producto,
                cantidad: e.cantidad,
                precioDetalle: e.precioDetalle,
                descripcion: descripcionFinal,
            };

            let detalle = new Detalle(detalleVenta);
            await detalle.save();
        }));

        const dataIngreso = {
            totalIngreso: totalVenta,
            descripcionIngreso: descripcionVenta,
            venta: idVenta
        }

        const ingreso = new Ingreso(dataIngreso)
        await ingreso.save()



        return res.json({
            msg: "Pedido Ingresado correctamente",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "algo salio mal en el Backend",
        });
    }
};

const editarPedido = async (req, res = response) => {
    try {
        const { pedido } = req.body;
        const {idVenta} =req.params
        const old = await Promise.all([
            Detalle.find({venta:idVenta}),
            Ingreso.findOne({venta:idVenta})
        ])
        await Ingreso.findByIdAndDelete(old[1]._id)
        old[0].forEach(async(e)=>{
            await Detalle.findByIdAndDelete(e._id)
        })
    

        // Sacamos datos para venta
        const totalVenta = pedido[0].totalpedido
        const tipoPedido = pedido[0].tipoPedido
        const mesa = pedido[0].mesa

        //data para venta
        const dataVenta = {
            totalVenta,
            tipoPedido,
            mesa
        }

        await Venta.findByIdAndUpdate(idVenta,dataVenta,{new: true})



        //Porcedemos a organizar los datos para la tabla
        // detalleVenta

        pedido.shift()

        //console.log(pedidos);
        //Llenamos la tabla detalleVenta con un forEach
        let descripcionVenta = ""; // Inicializamos la variable fuera del bucle

        await Promise.all(pedido.map(async (e) => {
            let { nombreProducto } = await Producto.findById(e.producto);
            descripcionVenta += `| ${nombreProducto} x ${e.cantidad} |`;
            let descripcionFinal = "";
            let descripcion = e.descripcion.join(", ");
            let adiciones = e.adiciones.join(", ");

            if (descripcion.length > 0 && adiciones.length > 0) {
                descripcionFinal = `${descripcion} y ${adiciones}`;
            } else {
                if (descripcion.length > 0) {
                    descripcionFinal = `${descripcion}`
                } else {
                    if (adiciones.length > 0) {
                        descripcionFinal = `${adiciones}`
                    }
                    else {
                        descripcionFinal = 'Sin adición'
                    }
                }
            }
            //console.log(descripcionFinal);

            let detalleVenta = {
                venta: idVenta,
                producto: e.producto,
                cantidad: e.cantidad,
                precioDetalle: e.precioDetalle,
                descripcion: descripcionFinal,
            };

            let detalle = new Detalle(detalleVenta);
            await detalle.save();
        }));

        const dataIngreso = {
            totalIngreso: totalVenta,
            descripcionIngreso: descripcionVenta,
            venta: idVenta
        }

        const ingreso = new Ingreso(dataIngreso)
        await ingreso.save()



        return res.json({
            msg: "Pedido editado correctamente",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "algo salio mal en el Backend",
        });
    }
};

const borrarPedido = async (req, res = response) => {

    try {
        
        const {idVenta} = req.params
    
        const old = await Promise.all([
            Detalle.find({venta:idVenta}),
            Ingreso.findOneAndDelete({venta:idVenta}),
            Venta.findByIdAndDelete(idVenta)
        ])
        old[0].forEach(async(e)=>{
            await Detalle.findByIdAndDelete(e._id)
        })
        return res.status(200).json({
            msg:'Pedido borrado correctamente'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:error
        })
    }



}
 


const obtenerPedidos = async (req, res = response) => {
    const ingresos = await Ingreso.find({}).populate("venta");

    const algo = await Detalle.find({});

    return res.json({
        ingresos,
    });
};

const obtenerVentas = async (req, res = response) => {
    try {
        const resp = await Venta.find({});

        return res.json(resp);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
};

const obtenerProductosPedido = async (req, res = response) => {
    try {

        const { id } = req.params;

        const existe = await Venta.findById(id);
        console.log(existe);
        if (!existe) {
            return res.status(400).json({
                msg: 'id no se encuentra en la DB'
            })
        }

        const productos = await Detalle.find({ venta: id })
            .populate("producto", "nombreProducto")

        return res.json(productos);
    } catch (error) {
        return res.status(500).json({
            msg: error
        })
    }
};

const infoPedidosEditar = async (req, res = response) => {
    const { id } = req.params


    const detalleProductos = await Detalle.find({ venta: id }).populate('producto').populate('venta')

    console.log(detalleProductos);


    return res.json({
        tabla: detalleProductos
    })

}

//Editar producto de una venta
const editarProductoVenta = async (req, res = response) => {
    const { id, idDetalleVenta } = req.params
    const { producto, cantidad, precioDetalle, descripcion } = req.body

    const venta = await Venta.findById(id)
    const detalleProducto = await Detalle.findById(idDetalleVenta)

    if (!venta) {
        return res.status(400).json({
            msg: `el id ${id} no se encuentra en las ventas`
        })
    }
    if (!detalleProducto) {
        return res.status(400).json({
            msg: `el idDetalleVenta ${idDetalleVenta} no se encuentra en detalleVenta`
        })
    }

    const dataDetalleNew = {
        producto,
        cantidad,
        precioDetalle,
        descripcion
    }

    //Editar producto de esa venta
    await Detalle.findByIdAndUpdate(idDetalleVenta, dataDetalleNew, { new: true })

    //Saco el nuevo total

    const total = await Detalle.find({ venta: id })

    let totalNew = 0
    total.forEach(element => {
        totalNew += element.precioDetalle
    })

    //editar total de la venta
    await Venta.findByIdAndUpdate(id, { totalVenta: totalNew }, { new: true })

    //editar total de ingreso
    const ingreso = await Ingreso.find({ venta: id })
    await Ingreso.findByIdAndUpdate(ingreso[0]._id, { totalIngreso: totalNew }, { new: true })

}


//borrar producto de una venta

//Borrar una venta completa

//Agregar producto a un pedido


module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerVentas,
    obtenerProductosPedido,
    infoPedidosEditar,
    borrarPedido,
    editarPedido

};

