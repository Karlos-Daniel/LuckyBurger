const { response } = require("express");
const { stringify } = require("uuid");
const { Producto, Detalle, Venta, Ingreso, Inventario } = require('../models');

const crearPedido = async(req,res=response)=>{
    
    try {
    const pedido = req.body
    for (const element of pedido.pedido[1]) {
           
        let inventario = await Inventario.find({producto:element.producto})
        
        if(inventario.length==1){
            
            let stockSumar = element.cantidad
            
            let idProducto = element.producto
            
            let stockOld = inventario[0].stock
            let stockNew = stockOld-stockSumar
            if(stockNew<0){
                return res.status(400).json({
                    msg: `No hay suficientes en Inventario ${element.producto}`
                })      
            }
        }
}
    //console.log(pedido);
    //Saco el total del pedido    
    const total = pedido.pedido[0].total
    
    //Saco el tipo de pedido
    const tipoPedido = pedido.pedido[0].tipoPedido

    //hago la data para la tabla Venta
    const dataVenta ={
        totalVenta:total,
        tipoPedido:tipoPedido
    }
    //Genero una nueva fila para la tabla Venta con la informacion de dataVenta
    const venta = new Venta(dataVenta);
    //Lo guardo en la DB
    await venta.save()

    const idVenta = venta._id
    //console.log(idVenta);
    //Seteo la data de la tabla Ingreso
    const dataIngreso ={
        totalIngreso:total,  
        venta: idVenta
    }

    //Genero la nueva fila para Ingreso
    const ingreso = new Ingreso(dataIngreso)
    //Guardo en la DB
    await ingreso.save()

    //Saco el Id del ingreso y lo declaro como constante

    const idIngreso = ingreso._id

    //Saco el Id de venta y lo declaro como constante
    
    
    //Mapeo el pedido para poder añadirle venta: idVenta a cada detalleVenta
    pedido.pedido[1]=pedido.pedido[1].map(element=>{
        return {...element,venta:idVenta}  
    });
    //console.log(pedido.pedido[1]);
    //por cada elemento lo guardo en detalleVentas
    




     pedido.pedido[1].forEach(async(element) => {
         let detalle = new Detalle(element)
         await detalle.save()
         let inventario = await Inventario.find({producto:element.producto})
        
         if(inventario.length==1){
             
             let stockSumar = element.cantidad
             
             let idProducto = element.producto
             
             let stockOld = inventario[0].stock
             let stockNew = stockOld-stockSumar

             let idInventarioUpdate = inventario[0]._id      
            await Inventario.findOneAndUpdate({_id:idInventarioUpdate},{stock: stockNew})
         }
         
     });
    let textoUnido = "";

    //mapeo para poder sacar todo lo que se compro y cuanto y si tuvo adicion o no
    await Promise.all(pedido.pedido[1]=pedido.pedido[1].map(async(element)=>{
            
        let {nombreProducto} = await Producto.findById(element.producto);
        console.log(nombreProducto);
        let adiciones = await Producto.findById(element.adicion)
        //console.log(element.adicion);
        if(element.adicion){
            textoUnido +=`${nombreProducto} x ${element.cantidad} con adicion de ${adiciones.nombreProducto},`
        }else{  
            textoUnido +=`${nombreProducto} x ${element.cantidad},`
        }
        
    }))

    //quito la ultima "," del texto
    const textoComa = textoUnido.substring(0, textoUnido.length - 1)
    //console.log(textoComa);

    //Updateo descripcion ingreso que genere antes
    await Ingreso.findByIdAndUpdate(idIngreso,{
        descripcionIngreso:textoComa
    },{new:true})
     
   return res.json({
    msg: "Pedido Ingresado correctamente"
   })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'algo salio mal en el Backend'
        })
    }

    
}

const obtenerPedidos = async(req,res=response)=>{
    const ingresos = await Ingreso.find({}).populate('venta','tipoPedido')
    
    const algo = await Detalle.find({})
    //ForEach de [algo] para updatear la cantidad de productos en inventario
    //let {stock} = await Inventario.find({producto:element.producto})
    //condicional para saber si stock >= element.cantidad, si no se cumple haga un res.json({msg:'la compra supera al stock'})
    // Inventario.findOneAndUpdate({stock:stock-element.cantidad})
    

    
   

    
    return res.json({
        ingresos
        
    })
}

module.exports={
    crearPedido,
    obtenerPedidos
}
// const obtenerPedidosPruebas = async(req,res=response)=>{
    
//    let contador = await Ingreso.find({})
    
//    let idDetalles = await Detalle.find({estado:true})
//    let dataDetalles=[]
//    let detalle;
//    await Promise.all(idDetalles = idDetalles.map(async(element)=>{
//     //console.log(element.adicion);
//     let adiciones = await Producto.findById(element.adicion)
//     detalle = await Detalle.find({}).populate('producto','nombreProducto')

    

//     //console.log(adiciones.nombreProducto);
    
//         let dataDetalless ={
//             //producto:detalle.producto.nombreProducto,
//             cantidad:element.cantidad,
//             adicion:adiciones.nombreProducto
//         }
//         dataDetalles.push(data)
        
//    }))
//    console.log(dataDetalles);
//    let dataProducto={}
//     detalle=detalle.map(async(element)=>{
//         dataProducto={
//             producto:element.producto.nombreProducto
//         }
//         //console.log(dataProducto);
//     })
//     console.log(dataProducto);
//    //console.log(detalle);
//    //console.log(dataDetalles);
   
//    //console.log(dataDetalles);
//    let data ={}
//    await Promise.all(contador = contador.map(async(element)=>{
        
//     //console.log(cantidad);

//     data={
        
//         descripcion: element.descripcionIngreso,
//         fecha: element.fechaIngreso,
//         total: element.totalIngreso
//     }
    
// }))

//     //console.log(contador);

//     return res.json({
//         totalVenta:data.total,

//     })
// }