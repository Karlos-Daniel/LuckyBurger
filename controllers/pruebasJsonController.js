const pruebasJson = async(req = request, res = response)=>{

    const JsonPrueba = req.body;

    return res.json({
        JsonPrueba
    })

}

module.exports = {
    pruebasJson
}