const con = require("../../db/conexion");
const querystring = require('../../node_modules/querystring');
const soap = require("../../node_modules/soap");
let obtenerplazas = async function consultar(){
    return new Promise(function(resolve,reject){
        var request = require('request');
        var url= "https://grupoalvarez.com.mx:4431/api/V2/PPCalculadoraWeb/GetPlazas"
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        json: true
        }, function(error, response, body){
            resolve(JSON.parse(JSON.stringify(response.body)));
        });
    });
}

let periocidadespoliticas = async function consultar(plaza){
    return new Promise(function(resolve,rejec){
        var request = require('request');
        var url= "https://grupoalvarez.com.mx:4431/api/V2/PPCalculadoraWeb/GetPeriodicidadesYPoliticasPorPlaza/"+plaza
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        contentType: 'text/json',
        url:     url,
        json: true
        }, function(error, response, body){
            resolve(JSON.parse(JSON.stringify(response.body)));
        });
    });
}
let getmontoabono = async function consultar(politica, monto){
    return new Promise(function(resolve,rejec){
        var request = require('request');
        var url= "https://grupoalvarez.com.mx:4431/api/V2/PPCalculadoraWeb/GetMontoAbono/"+politica+"/"+monto
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        json: true
        }, function(error, response, body){
            resolve(JSON.parse(JSON.stringify(response.body)));
        });
    });
}

let postgrabarsolicitudcalculadora = async function consultar(nombre, telefono, correo, fecha, cplaza, monto , cpolitica){
    return new Promise(function(resolve,rejec){
       let myJSONObject ={
        Nombre: nombre,
        Telefono: telefono,
        CorreoElectronico : correo,
        Fecha : fecha,
        CodigoPlaza : cplaza ,
        MontoSolicitado : monto,
        CodigoPolitica: cpolitica
       }
        var request = require('request');
        var url= "https://grupoalvarez.com.mx:4431/api/V2/PPCalculadoraWeb/PostGrabarSolicitudCalculadoraPP"
            var request = require('request');
            request.post({
            headers: { "content-type": "application/json"},
            url: url,
            body: (myJSONObject),
            json:true
            }, function(error, response, body){
                resolve(JSON.parse(JSON.stringify(response.body)));
            });
    });
}
let consultarprestamo = async function consultar(codigosucursal,codigoprestamo,importe){
    return new Promise(function(resolve,rejec){

        // var url= "http://intranet.maxilana.com/wsprestamos/serviciosprestamos.asmx?WSDL"
        const url= "http://intranet.maxilana.com/wsprestamos/serviciosprestamos.asmx?WSDL"
        const args = {
            strCodigoSucursal: codigosucursal,
            strCodigoPrestamo: codigoprestamo,
            intPrestamo : importe,
            strNombreCliente : '',
            dblMontoLiquidaCon : 0 ,
            dblMontoAlCorriente : 0,
            strFechaVencimiento: '',
            strMensaje:'',
            strTelefonoMovil:'',
        };
        soap.createClient(url, function(err, client) {
            if (err) console.error(err);
            else {
              client.PagosEnLineaPrestamosPersonalesObtenerInformacionPrestamoPersonal2(args, function(err, response) {
                if (err) console.error(err);
                else {
                    result = JSON.parse(JSON.stringify(response));
                    // result["Celular"]="6671935021"
                    resolve(result);
                  
                }
              });
            }
          });
    });
}

module.exports={
    periocidadespoliticas,
    obtenerplazas,
    getmontoabono,
    postgrabarsolicitudcalculadora,
    consultarprestamo
}
