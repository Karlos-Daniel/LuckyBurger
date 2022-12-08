//PARA HACER
const { response } = require("express");
const { stringify } = require("uuid");
const { Proveedor,DetalleCompra,Egreso,Compra,Producto,Inventario } = require('../models');
const { findByIdAndUpdate } = require("../models/categoriaModel");


const crearCompra = async(req,res=response)=>{
    
    try {
        const compra = req.body
        console.log(compra.compra[0]);
        const totalCompra = compra.compra[0].totalCompra;
        const dataCompra = {
            totalCompra:totalCompra
        }
        const compraModel = new Compra(dataCompra)
        //await compraModel.save()

        const dataEgreso = {
            totalEgreso:totalCompra
        }
        //console.log(compra[1]);
        const egresoModel = new Egreso(dataEgreso)
        //await egresoModel.save()

        compra.compra[1]=compra.compra[1].map(async(element)=>{
            return {...element,compra:compraModel._id}
        })
        let textoUnido = "";
        
    //mapeo para poder sacar todo lo que se compro y cuanto y si tuvo adicion o no
    await Promise.all(compra.compra[1]=compra.compra[1].map(async(element)=>{
            
        let {nombreProducto} = await Producto.findById(element.producto);
        //console.log(element.precioCompra);
         
        textoUnido +=`${nombreProducto} x ${element.cantidad},`

        let inventario = await Inventario.findById(element.producto)

        if(inventario){
            let stockOdl = inventario.stock
            let stockNew = stockOdl+element.cantidad;
            let dataInventario ={
                producto: element.producto,
                stock:stockNew              
            }
            await findByIdAndUpdate(dataInventario)

        }else{
            let dataInventario ={
                producto: element.producto,
                stock: element.cantidad
            }
            let nuevoInventario = await new Inventario(dataInventario)
            await nuevoInventario.save()
        }
        
        
    }))

    console.log(textoUnido);
    

    //quito la ultima "," del texto
    const textoComa = textoUnido.substring(0, textoUnido.length - 1)
    //console.log(textoComa);

        
       return res.json({
        msg: "Pruebas"
       })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: 'algo salio mal en el Backend'
            })
        }

    
}
const crearCompra2 = async(req,res=response)=>{
    
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
    //console.log(idVenta);
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
    //console.log(pedido.pedido[1]);
    //por cada elemento lo guardo en detalleVentas

    await Promise.all(compra.compra[1].forEach(async(element) => {
        let detalleCompra = new DetalleCompra(element)
        await detalleCompra.save()
        let inventario = await Inventario.find({producto:element.producto})

        console.log(element);
    }))
    
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
    crearCompra,
    crearCompra2
}



