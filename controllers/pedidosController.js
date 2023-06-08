const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso, Inventario } = require("../models");
const {editarIngreso} = require('../helpers/editarIngreso')
const { find, findByIdAndUpdate } = require("../models/categoriaModel");


const crearPedido = async (req, res = response) => {
    try {
        const pedido = req.body;
        
        //console.log(pedido);
        //Saco el total del pedido
        const total = pedido.pedido[0].total;

        //Saco la mesa
        const mesa = pedido.pedido[0].mesa;

        //Saco el tipo de pedido
        const tipoPedido = pedido.pedido[0].tipoPedido;

        //hago la data para la tabla Venta
        const dataVenta = {
            totalVenta: total,
            tipoPedido: tipoPedido,
            mesa: mesa,
        };
        //Genero una nueva fila para la tabla Venta con la informacion de dataVenta
        const venta = new Venta(dataVenta);
        //Lo guardo en la DB
        await venta.save();

        const idVenta = venta._id;
        //console.log(idVenta);

        //Seteo la data de la tabla Ingreso
        const dataIngreso = {
            totalIngreso: total,
            venta: idVenta,
        };

        //Genero la nueva fila para Ingreso
        const ingreso = new Ingreso(dataIngreso);
        //Guardo en la DB
        await ingreso.save();

        //Saco el Id del ingreso y lo declaro como constante

        const idIngreso = ingreso._id;

        //Saco el Id de venta y lo declaro como constante

        //Mapeo el pedido para poder añadirle venta: idVenta a cada detalleVenta
        pedido.pedido[1] = pedido.pedido[1].map((element) => {
            return { ...element, venta: idVenta };
        });
        //console.log(pedido.pedido[1]);
        //por cada elemento lo guardo en detalleVentas

        pedido.pedido[1].forEach(async (element) => {
            //console.log(element);
            let detalle = new Detalle(element);
            await detalle.save();
            
        });
        let textoUnido = "";

        //mapeo para poder sacar todo lo que se compro y cuanto
        await Promise.all(
            (pedido.pedido[1] = pedido.pedido[1].map(async (element) => {
                let { nombreProducto } = await Producto.findById(element.producto);
               
                textoUnido += `${nombreProducto} x ${element.cantidad},`;
                
            }))
        );

        //quito la ultima "," del texto
        const textoComa = textoUnido.substring(0, textoUnido.length - 1);
        //console.log(textoComa);

        //Updateo descripcion ingreso que genere antes
        await Ingreso.findByIdAndUpdate(
            idIngreso,
            {
                descripcionIngreso: textoComa,
            },
            { new: true }
        );

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
 
