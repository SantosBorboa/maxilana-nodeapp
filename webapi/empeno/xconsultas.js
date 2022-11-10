const con = require("../../db/conexion");
const soap = require("../../node_modules/soap");
let obtenerinfoboleta = async function consultar(boleta,letra,prestamo){
    return new Promise(function(resolve,reject){
        var url= "http://intranet.maxilana.com/wsconsultaboleta/serviciosconsultaboleta.asmx?WSDL"
        const args = { strBoleta: boleta, strIdentificador: letra, strImporte:prestamo};
        soap.createClient(url, function(err, client) {
            if (err) console.error(err);
            else {
              client.RegresaBoleta(args, function(err, response) {
                if (err) console.error(err);
                else {
                    result = JSON.parse(JSON.stringify(response));
                    resultado = result["RegresaBoletaResult"]["diffgram"];
                    if(resultado == null){
                        let end ={
                            error : 'La boleta ingresada no existe'
                        }
                        resolve(end);
                    }else{
                        result = result["RegresaBoletaResult"]["diffgram"]["NewDataSet"]["Informacion"];
                        prestamo = parseFloat(prestamo).toFixed(2);
                        prestamoReal = parseFloat(result.Prestamo).toFixed(2);
                        if(prestamo == prestamoReal){
                            let objCom = {
                                comision:'1.03'
                            }
                            Object.assign(result, objCom);
                            resolve(result);
                        }
                       else{
                           let error={
                               error : "La información ingresada no es correcta."
                           }
                           resolve(error);
                       }
                    }
                  
                }
              });
            }
          });
    });
}
let avaluodeauto = async function consultar(ciudad,marca,modelo,tipo,cantidad,correo,telefono,nombre,primerapellido,segundoapellido,fechanacimiento){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx/wsBusquedaArticulos/ServiciosBusquedaArticulos.asmx?WSDL"
        const args = { 
            strCiudad: ciudad, 
            strMarca: marca, 
            strModelo:modelo,
            strTipo:tipo,
            strCantidad:cantidad,
            strCorreoElectronico:correo,
            strTelefono:telefono,
            strNombre:nombre,
            strPrimerApellido:primerapellido,
            strSegundoApellido:segundoapellido,
            strFechaNacimiento:fechanacimiento
        };
        soap.createClient(url, function(err, client) {
            if (err) console.error(err);
            else {
              client.GrabarSolicitudDeAvaluoDeAuto(args, function(err, response) {
                if (err) console.error(err);
                else {
                    result = JSON.parse(JSON.stringify(response));
                    resolve(result);
                }
              });
            }
          });
    });
}
let calculadoraempeno = async function consultar(plaza,correo,valorprenda,codigoarticulo){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/PlazasWeb/PlazasWeb?CodigoPlaza="+plaza+"&CodigoArticulo="+codigoarticulo+"&ValorPrenda="+valorprenda+"&CorreoElectronico="+correo;
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
          resolve(response.body);
        });
    });
}
let calculadoraempenoplazas = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/Plazas/Plazas";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            var ArrayPlazas = [];
            var Contador = 0;
            Resultado = JSON.parse(response.body);
            for(var i = 0; i < Resultado.Plazas.length ; i++){
                if(Resultado.Plazas[i].Activo == true){
                    ArrayPlazas[Contador] = Resultado.Plazas[i];
                    Contador = Contador+1;
                }
            }
            resolve(ArrayPlazas);
        });
    });
}
let calculadoramarcas = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/PlazasWeb/catMarcas";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            var ArrayPlazas = [];
            var Contador = 0;
            Resultado = JSON.parse(response.body);
            resolve(Resultado);
        });
    });
}
let calculadorakilatajes = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/PlazasWeb/catKilatajes";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            var ArrayPlazas = [];
            var Contador = 0;
            Resultado = JSON.parse(response.body);
            resolve(Resultado);
        });
    });
}
let obtenerversionapp = async function consultar(){
    let selectinicial = 'select * from versionappmaxilana'
    return new Promise(function(resolve,reject){
        let query = selectinicial;
        con.connection.query(query, function (error, results, fields) {
            if(results != undefined){
                console.log(results);
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado[0]);
            }else{
                resolve("No hay información para mostrar.")
            }

         });
    });
}
module.exports={
    obtenerinfoboleta,
    calculadoraempeno,
    obtenerversionapp,
    calculadoraempenoplazas,
    avaluodeauto,
    calculadoramarcas,
    calculadorakilatajes
}