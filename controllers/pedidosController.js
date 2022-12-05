const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso } = require('../models');

const crearPedido = async(req,res=response)=>{
    
    try {
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
        //console.log(detalle);
        await detalle.save()
    });
    let textoUnido = "";

    await Promise.all(pedido.pedido[1]=pedido.pedido[1].map(async(element)=>{
            
        let {nombreProducto} = await Producto.findById(element.producto);
        let adiciones = await Producto.findById(element.adicion)
        
        if(element.adicion){
            textoUnido +=`${nombreProducto} x ${element.cantidad} con adicion de ${adiciones.nombreProducto},`
        }else{  
            textoUnido +=`${nombreProducto} x ${element.cantidad},`
        }
        
    }))
    const textoComa = textoUnido.substring(0, textoUnido.length - 1)
    //console.log(textoComa);
    await Ingreso.findByIdAndUpdate(idIngreso,{descripcionIngreso:textoComa},{new:true})
     
   return res.json({
    msg: "Pedido Ingresado correctamente"
   })
    } catch (error) {
        return res.status(500).json({
            msg: 'algo salio mal en el Backend'
        })
    }

    
}

const obtenerPedidosPruebas = async(req,res=response)=>{
    
   let contador = await Ingreso.find({})
    
   let idDetalles = await Detalle.find({estado:true})
   let dataDetalles=[]
   let detalle;
   await Promise.all(idDetalles = idDetalles.map(async(element)=>{
    //console.log(element.adicion);
    let adiciones = await Producto.findById(element.adicion)
    detalle = await Detalle.find({}).populate('producto','nombreProducto')

    

    //console.log(adiciones.nombreProducto);
    
        let dataDetalless ={
            //producto:detalle.producto.nombreProducto,
            cantidad:element.cantidad,
            adicion:adiciones.nombreProducto
        }
        dataDetalles.push(data)
        
   }))
   console.log(dataDetalles);
   let dataProducto={}
    detalle=detalle.map(async(element)=>{
        dataProducto={
            producto:element.producto.nombreProducto
        }
        //console.log(dataProducto);
    })
    console.log(dataProducto);
   //console.log(detalle);
   //console.log(dataDetalles);
   
   //console.log(dataDetalles);
   let data ={}
   await Promise.all(contador = contador.map(async(element)=>{
        
    //console.log(cantidad);

    data={
        
        descripcion: element.descripcionIngreso,
        fecha: element.fechaIngreso,
        total: element.totalIngreso
    }
    
}))

    //console.log(contador);

    return res.json({
        totalVenta:data.total,

    })
}

const obtenerPedidos = async(req,res=response)=>{
    const ingresos = await Ingreso.find({})
    console.log(ingresos);
    
   


    return res.json({
        ingresos

    })
}

module.exports={
    crearPedido,
    obtenerPedidos
}