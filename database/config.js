const mongoose = require('mongoose');

const dbConnection = async()=>{

    try{

        await mongoose.connect(process.env.MONGODB_ATLAR,{
            useNewUrlParser: true,
            useUnifiedTopology: true
            
        });

        console.log('BASE DE DATOS CONECTADA');

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }

}


module.exports = {
    dbConnection
}