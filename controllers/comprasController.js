//PARA HACER
const { response } = require("express");
const { stringify } = require("uuid");
const { Proveedor,DetalleCompra,Egreso,Compra,Producto } = require('../models');


const crearCompra = async(req,res=response)=>{
    try {
        
        const compras = req.body
        const {totalCompra} = compras.compra[0]

        const dataEgreso ={
            totalEgreso: totalCompra
        }
        const dataCompra ={
            totalCompra: totalCompra
        }

        const egreso = new Egreso(dataEgreso)
        await egreso.save()
        const idEgreso = egreso._id
        const compra = new Compra(dataCompra)
        await compra.save()

        const idCompra = compra._id
        //console.log(idCompra);

        compras.compra[1]=compras.compra[1].map(element=>{
            return {...element,compra:idCompra}
        })

        //guardo en detalleCompras
        compras.compra[1].forEach(async(element) => {
            let detalleCompra = new DetalleCompra(element)
            await detalleCompra.save()



        });


        let textoUnido = "";

    //mapeo para poder sacar todo lo que se compro y cuanto y si tuvo adicion o no
    await Promise.all(compras.compra[1]=compras.compra[1].map(async(element)=>{
            
        let {nombreProducto} = await Producto.findById(element.producto);
          
        textoUnido +=`${nombreProducto} x ${element.cantidad},`
        
        
    }))

    //quito la ultima "," del texto
    const textoComa = textoUnido.substring(0, textoUnido.length - 1)
    console.log(textoComa);

    await Egreso.findByIdAndUpdate(idEgreso,{
        descripcionEgreso:textoComa
    },{new:true})

        //FALTA QUE CREE O UPDATE EN INVENTARIO
        /*
            
            con un foreach
            Si no encuentra el producto en el inventario lo cree
            fin({producto:element.producto})
            
            Si lo encuentra que updatee el stock en base a lo que compro

        */
        
        return res.json({
            msg: 'En pruebas'
        })

    } catch (error) {
        return res.status(500).json({
            msg:'Se daño el Backend, llame al Inge'
        })
    }
}

module.exports = {
    crearCompra
}
/* 

    Recibir inforamacion
    crear una venta
    Mapear lo que recibo y asignar venta
    forEach a eso para updatear Inventario
    Mapear para asignar a egreso

*/

