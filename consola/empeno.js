const { Date } = require('mssql');
const con = require('../db/conexion');
const libsodium = require('../webapi/libsodium/libsodium')
let Obtenerpagos = async function consulta(boleta,codauth,ref){

    return new Promise(function(resolve,reject){
        
        var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/consultas/pagosempeno/"+boleta+"/"+codauth+"/"+ref;
        var request = require('request');
        request(url, function (error, response, body) {
             ResultadoSQL = JSON.parse(response.body);
             let arr = ResultadoSQL.data.response;
             resolve(arr)
        });

    });

}
let obtenerinfo3d = async function consulta(Referencia){
    return new Promise(function(resolve,reject){
    let sql='SELECT upc,monto,info.eci,info.xid,info.cavv,info.status,info.cardtype,info.pagoapp,fecha FROM `informacionTransaccionVentas` i inner join informacion3dsecure info on idPrincipal=info.reference or id=info.reference where id='+"'"+Referencia+"'";

    con.connection.query(sql, function (error, results, fields) {
        if(results != undefined){
        Resultado = JSON.parse(JSON.stringify(results));
            resolve(Resultado[0]);
    }
    else{
        let err={
            err :'No hay informacion para mostrar.'
            }
            resolve(err)
        }
    });
 })
}
module.exports={
    Obtenerpagos,
    obtenerinfo3d
}
