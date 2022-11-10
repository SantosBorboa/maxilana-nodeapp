const { Date } = require('mssql');
const con = require('../db/conexion');
const libsodium = require('../webapi/libsodium/libsodium')
const querystring = require('../node_modules/querystring');
let obtenerventas = async function consulta(tipo, upc) {
    return new Promise(function (resolve, reject) {
        var url = "http://grupoalvarez.com.mx:8089/maxilanaApp/api/Consultas/ventas/tipo/" + tipo + "/upc/" + upc;
        console.log(url)
        var request = require('request');
        request(url, function (error, response, body) {
            ResultadoSQL = JSON.parse(response.body);
            let arr = ResultadoSQL.data.response;
            resolve(arr)
        });
    });
}

let cancelarpago = async function consulta(referencia) {
    return new Promise(async function (resolve, reject) {
        var myJSONObject = {
            MERCHANT_ID: 8279402,
            USER: 'e8279402',
            PASSWORD: 'X=a6p$1M',
            CMD_TRANS: 'VOID',
            TERMINAL_ID: '82794021',
            MODE: 'PRD',  //DEC PRD AUT
            REFERENCE: referencia,
            ENTRY_MODE: 'MANUAL',
        };
        var data = await querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            var i = response.headers;
            resolve(i)
        });
    });
}
module.exports = {
    obtenerventas,
    cancelarpago
}