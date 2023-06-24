const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso, Inventario } = require("../models");
const {editarIngreso} = require('../helpers/editarIngreso')
const { find, findByIdAndUpdate } = require("../models/categoriaModel");


const crearPedido = async (req, res = response) => {
    try {
        const {pedido,mesa,tipoPedido,totalPedido} = req.body;



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
        if(!existe){
            return res.status(400).json({
                msg:'id no se encuentra en la DB'
            })
        }

        const productos = await Detalle.find({ venta: id })
            .populate("producto", "nombreProducto")
    
        return res.json(productos);
    } catch (error) {
        return res.status(500).json({
            msg:error
        })
    }
};

const infoPedidosEditar = async(req,res=response)=>{
    const {id} = req.params


    const detalleProductos = await Detalle.find({venta:id}).populate('producto').populate('venta')

    console.log(detalleProductos);


    return res.json({
        tabla:detalleProductos
    })

}

//Editar producto de una venta
const editarProductoVenta = async(req,res=response)=>{
    const {id,idDetalleVenta} = req.params
    const {producto,cantidad,precioDetalle,descripcion} = req.body

    const venta = await Venta.findById(id)
    const detalleProducto = await Detalle.findById(idDetalleVenta)

    if(!venta){
        return res.status(400).json({
            msg:`el id ${id} no se encuentra en las ventas`
        })
    }
    if(!detalleProducto){
        return res.status(400).json({
            msg:`el idDetalleVenta ${idDetalleVenta} no se encuentra en detalleVenta`
        })
    }

    const dataDetalleNew = {
        producto,
        cantidad,
        precioDetalle,
        descripcion
    }

    //Editar producto de esa venta
    await Detalle.findByIdAndUpdate(idDetalleVenta,dataDetalleNew,{new:true})

    //Saco el nuevo total

    const total = await Detalle.find({venta: id})

    let totalNew = 0
    total.forEach(element=>{
        totalNew += element.precioDetalle
    })

    //editar total de la venta
    await Venta.findByIdAndUpdate(id,{totalVenta: totalNew},{new:true})

    //editar total de ingreso
    const ingreso = await Ingreso.find({venta:id})
    await Ingreso.findByIdAndUpdate(ingreso[0]._id,{totalIngreso:totalNew},{new:true})

}


//borrar producto de una venta

//Borrar una venta completa

//Agregar producto a un pedido


module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerVentas,
    obtenerProductosPedido,
    infoPedidosEditar

};
 
