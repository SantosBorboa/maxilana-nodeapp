const con = require("../../db/conexion");
let guardarcontacto = async function consultar(tema,nombre,email,ciudad,asunto,mensaje){
    return new Promise(function(resolve,reject){
        let query = 'insert into contactocliente(tema, nombre, correoelectronico, ciudad, asunto, mensaje, fecha) values '+
                    '('+"'"+tema+"'"+', '+"'"+nombre+"'"+', '+"'"+email+"'"+', '+"'"+ciudad+"'"+','+"'"+asunto+"'"+','+"'"+mensaje+"'"+',now())';
        con.connection.query(query, function (error, results, fields) {
            resolve("OK");
       });
    });
}
module.exports ={
    guardarcontacto
}