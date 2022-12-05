const { response } = require("express");
const { Producto, Detalle, Venta, Ingreso } = require('../models');

const crearPedido = async(req,res=response)=>{
    
    const pedido = req.body
    
    const total = pedido.pedido[0].total
    const tipoPedido = pedido.pedido[0].tipoPedido
    const dataVenta ={
        totalVenta:total,
        tipoPedido:tipoPedido
    }

    const venta = new Venta(dataVenta);
    await venta.save()
    const dataIngreso ={
        totalIngreso:total,  
    }

    const ingreso = new Ingreso(dataIngreso)
    await ingreso.save()
    const idIngreso = ingreso._id

    const idVenta = venta._id
    
    pedido.pedido[1]=pedido.pedido[1].map(element=>{
        return {...element,venta:idVenta}
        
    });
    
    pedido.pedido[1].forEach(async(element) => {
        let detalle = new Detalle(element)
        await detalle.save()
    });
    let textoUnido = "";

    await Promise.all(pedido.pedido[1]=pedido.pedido[1].map(async(element)=>{
            
        let {nombreProducto} = await Producto.findById(element.producto);
        
        textoUnido +=`${nombreProducto},`
        //console.log(textoUnido);
    }))
    const textoComa = textoUnido.substring(0, textoUnido.length - 1)
    
    await Ingreso.findByIdAndUpdate(idIngreso,{descripcionIngreso:textoComa},{new:true})
     
   return res.json({
    msg: "textosss"
   })
}

module.exports={
    crearPedido
}