const con = require("../../db/conexion");
let Resultado = [];
let Consultar = async function consultar(){

    return new Promise(function(resolve,reject){
    let query = 'SELECT * FROM ciudades where activo=1';
        con.connection.query(query, function (error, results, fields) {
            Resultado = JSON.parse(JSON.stringify(results));
            resolve(Resultado)
         });
    });
}
module.exports={
    Consultar
}
