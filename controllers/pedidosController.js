const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso, Inventario } = require("../models");
const {editarIngreso} = require('../helpers/editarIngreso')
const { find } = require("../models/categoriaModel");
const { all } = require("../routes/pedidos.routes");

const crearPedido = async (req, res = response) => {
    try {
        const pedido = req.body;
        for (const element of pedido.pedido[1]) {
            let inventario = await Inventario.find({ producto: element.producto });

            if (inventario.length == 1) {
                let stockSumar = element.cantidad;

                let idProducto = element.producto;

                let stockOld = inventario[0].stock;
                let stockNew = stockOld - stockSumar;
                if (stockNew < 0) {
                    return res.status(400).json({
                        msg: `No hay suficientes en Inventario ${element.producto}`,
                    });
                }
            }
        }
        //console.log(pedido);
        //Saco el total del pedido
        const total = pedido.pedido[0].total;

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
            let detalle = new Detalle(element);
            await detalle.save();
            let inventario = await Inventario.find({ producto: element.producto });

            if (inventario.length == 1) {
                let stockSumar = element.cantidad;

                let idProducto = element.producto;

                let stockOld = inventario[0].stock;
                let stockNew = stockOld - stockSumar;

                let idInventarioUpdate = inventario[0]._id;
                await Inventario.findOneAndUpdate(
                    { _id: idInventarioUpdate },
                    { stock: stockNew }
                );
            }
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
    const { id } = req.params;
    const productos = await Detalle.find({ venta: id })
        .populate("producto", "nombreProducto")

    return res.json(productos);
};

const editarProductoPedido = async (req, res = response) => {
    try {
        const { idProducto, idVenta } = req.params;
        const detalle = await Detalle.findById(idProducto);
        //console.log(detalle.cantidad);
        const venta = await Venta.findById(idVenta);
        if (!detalle || !venta) {
            return res.status(400).json({
                msg: "El producto no existe en esa venta o la venta",
            });
        }

        const data = req.body;
        const newProducto = await Detalle.findByIdAndUpdate(idProducto, data, {
            new: true,
        });

        //Se actualizara el inventario
        const inventario = await Inventario.find({
            producto: newProducto.producto,
        });
        

        if (inventario.length>0) {
            const nuevoStock =
                inventario[0].stock + (detalle.cantidad - newProducto.cantidad);
            if (nuevoStock < 0) {
                return res.status(400).json({
                    msg: "No hay suficientes en el inventario",
                });
            }
            await Inventario.findByIdAndUpdate(
                inventario[0]._id,
                { stock: nuevoStock },
                { new: true }
            );
        }
        await editarIngreso(idVenta);

        //fin actualizacion inventario

        return res.json({
            msg: "salio con exito editar el producto en el pedido",
        });
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
};

const agregarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { producto, cantidad, precioDetalle} = req.body;
    const venta = await Venta.findById(id);
    if (!venta) {
        return res.json({
            msg: "No existe la venta",
        });
    }
    const data = {
        producto: producto,
        cantidad: cantidad,
        precioDetalle: precioDetalle,
        venta: id,
    };
    const inventario = await Inventario.find({ producto: producto });

    if (inventario) {
        const nuevoStock = inventario[0].stock - cantidad;
        if (nuevoStock < 0) {
            return res.status(400).json({
                msg: "No hay suficientes en el inventario",
            });
        }
        await Inventario.findByIdAndUpdate(
            inventario[0]._id,
            { stock: nuevoStock },
            { new: true }
        );
    }
    
    const newProducto = new Detalle(data);

    await Detalle.save();
    await editarIngreso(id)

    return res.json({
        msg: "Se creo el nuevo producto en esta venta",
    });
};

const editarVenta = async (req, res = response) => {

    try {
        const { id } = req.params;
    
        const venta = await Venta.findById(id);
        
        if (!venta) {
            return res.json({
                msg: "No existe la venta en la db",
            });
        }
        
        const data = req.body;
        
        await Venta.findByIdAndUpdate(id, data, { new: true });
        
        await editarIngreso(id)
        return res.json({
            msg: "Se actualizo la venta correctamente",
        });
        
    } catch (error) {
        return res.status(500).json({
            msg:'Se cayo el backend'
        })
    }


};

const borrarProductoPedido = async (req, res = response) => {

    try {
        
        const { idProducto, idVenta } = req.params;
        const detalle = await Detalle.findById(idProducto);
        const venta = await Venta.findById(idVenta);
        if (!detalle || !venta) {
            return res.status(400).json({
                msg: "El producto no existe en esa venta o la venta",
            });
        }
    
        await Detalle.findByIdAndDelete(idProducto)
    
        return res.json({
            msg:'Se borro producto de la venta correctamente'
        })
    } catch (error) {
        return res.status(500).json({
            msg:'Se cayo el backend'
        })
    }


};

const borrarVenta = async (req, res = response) => {

    try {
        
        const { id } = req.params;
    
        const venta = await Venta.find({ _id: id });
        if (!venta) {
            return res.status(400).json({
                msg: "la venta no existe",
            });
        }
    
        await Promise.all([
            Venta.findByIdAndDelete(id),
            Ingreso.findOneAndDelete({ venta: id }),
        ]);
    
        const productos = await Detalle.find({ venta: id });
        productos.forEach(async (e) => {
            await Detalle.findByIdAndDelete(e._id);
        });
    
        return res.json({
            msg: "Venta borrada con exito",
        });
    } catch (error) {
        return res.status(500).json({
            msg:'Se cayo el backend'
        })
    }
};

module.exports = {
    crearPedido,
    obtenerPedidos,
    obtenerVentas,
    borrarProductoPedido,
    borrarVenta,
    editarVenta,
    agregarProducto,
    obtenerProductosPedido,
    editarProductoPedido,
};
 
