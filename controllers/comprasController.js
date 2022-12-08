//PARA HACER
const { response } = require("express");
const { stringify } = require("uuid");
const { Proveedor,DetalleCompra,Egreso,Compra,Producto,Inventario } = require('../models');
const { findByIdAndUpdate } = require("../models/categoriaModel");



const crearCompra = async(req,res=response)=>{
    
    try {
    const compra = req.body
    
    //console.log(compra.compra[1]);
    //Saco el total del pedido    
    const totalCompra = compra.compra[0].totalCompra
    
   
    

    //hago la data para la tabla Compra
    const dataCompra = {
        totalCompra:totalCompra
    }
    //Genero una nueva fila para la tabla Venta con la informacion de dataVenta
    const compraModel = new Compra(dataCompra);
    //Lo guardo en la DB
    await compraModel.save()

    const IdCompra = compraModel._id
    
    //Seteo la data de la tabla Ingreso
    const dataEgreso ={
        totalEgreso:totalCompra,  
        compra: IdCompra
    }

    //Genero la nueva fila para Ingreso
    const egresoModel = new Egreso(dataEgreso)
    //Guardo en la DB
    await egresoModel.save()

    //Saco el Id del ingreso y lo declaro como constante

    const idEgreso = egresoModel._id

    //Saco el Id de venta y lo declaro como constante
    
    
    //Mapeo el pedido para poder añadirle venta: idVenta a cada detalleVenta
    compra.compra[1]=compra.compra[1].map(element=>{
        return {...element,compra:IdCompra}  
    });
    let arr = []
    
    
    //por cada elemento lo guardo en detalleVentas
    
    compra.compra[1].forEach(async(element) => {
        let detalleCompra = new DetalleCompra(element)
        await detalleCompra.save()
        
        let inventario = await Inventario.find({producto:element.producto})
        console.log('ESTO ES EL INVENTARIO');
        console.log(inventario);
        if(inventario.length==1){
            console.log('ENTRA EN EL PRIMERO');
            console.log(element);
            let stockSumar = element.cantidad
            
            let idProducto = element.producto
            
            
            let stockOld = inventario[0].stock
            let stockNew = stockOld+stockSumar
            let idInventarioUpdate = inventario[0]._id
            
            await Inventario.findOneAndUpdate({_id:idInventarioUpdate},{stock: stockNew})   
        }
        if (inventario.length===0) {
            console.log('ENTRA EN EL SEGUNDO');
            
            let dataInventario ={
                producto:element.producto,
                stock: element.cantidad
            }
            console.log(dataInventario);
            let detalleCompra = new Inventario(dataInventario)
            await detalleCompra.save()
        }
        
    })
   
    
    let textoUnido = "";

    //mapeo para poder sacar todo lo que se compro y cuanto y si tuvo adicion o no
    await Promise.all(compra.compra[1]=compra.compra[1].map(async(element)=>{
            
        let {nombreProducto} = await Producto.findById(element.producto);
        //console.log(nombreProducto);
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
     await Egreso.findByIdAndUpdate(idEgreso,{
         descripcionEgreso:textoComa
     },{new:true})
     await Compra.findByIdAndUpdate(IdCompra,{
        descripcionCompra:textoComa
    },{new:true})
     
   return res.json({
    msg: "Compra Ingresado correctamente"
   })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'algo salio mal en el Backend'
        })
    }

    
}

module.exports = {
    
    crearCompra
}



