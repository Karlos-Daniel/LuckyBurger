const {Caja} = require('../models');


const fechaHoy = ()=>{
    const dia = new Date().getDate();
    const mes = new Date().getMonth();
    const year = new Date().getFullYear();
    const fechaActual = `${dia}/${mes}/${year}`;

    return fechaActual;

}

const cantidadDeVecesAbierta = async() => {
    const fechaActual = fechaActual()
    const infoCaja = await Caja.find({fechaCaja:fechaActual})
    const veces = infoCaja.length
    return veces
}



const socketController = (socket)=>{
    console.log("Un cliente se ha conectado");

    socket.on("disconnect", () => {
      console.log("Un cliente se ha desconectado");
    });

    socket.on("Abierta", async () => {
        const fechaActual = fechaHoy()
        const infoCaja = await Caja.find({fechaCaja:fechaActual})

        if(!infoCaja){
            const dataCaja ={
                fechaCaja:fechaActual,
                vecesAbierta:1
            }

            const primeraApertura = await new Caja(dataCaja)
            await primeraApertura.save();
            socket.emit("VecesAbierta", 1);
        }else{
            const cantidad = infoCaja[0].vecesAbierta + 1;
            await Caja.findByIdAndUpdate(infoCaja[0]._id,{vecsAbierta:cantidad},{new:true});
            socket.emit("VecesAbierta", cantidad);
        }

        socket.on("cantidadVecesAbierta",()=>{
            
            socket.emit("CantidadHoy",cantidadDeVecesAbierta)

        })
      
    });
  
}

module.exports = {
    socketController
}