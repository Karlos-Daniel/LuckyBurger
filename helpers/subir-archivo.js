
const path = require('path')
const { v4: uuidv4 } = require('uuid');
uuidv4();


const subirArchivo = async(files, extensionesValidas = ['jpg', 'png', 'jpeg', 'gif'], carpeta = '') => {
    
    return new Promise((resolve, reject) => {
        const archivo = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        
        if (!extensionesValidas.includes(extension)) {
            return reject(`la extension .${extension} no es una extension valida, ${extensionesValidas}`)
        }

        const nombreTemp = uuidv4() + '.' + extension;
        console.log(nombreTemp);
        const uploadPath = path.join(__dirname, `../uploads/`,carpeta, nombreTemp);
        console.log(uploadPath);
        archivo.mv(uploadPath, (err) => {
            if (err) {
               return reject(err)
            }
           return resolve(nombreTemp)
        });
    });

    
}

module.exports = {
    subirArchivo
}