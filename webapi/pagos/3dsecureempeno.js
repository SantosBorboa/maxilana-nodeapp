const con = require("../../db/conexion");
const libsodium = require("../libsodium/libsodium.js");
var uniqid = require("uuid");
const env = require('../../node_modules/dotenv').config({ path: '../../.env' });
let Obteneridboleta = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,correoelectronico,Monto,Sucursal,boleta,montoboleta,codigotipopago,fechac,diaspagados){

    return new Promise(function(resolve,reject){

        let id = uniqid.v4();
        id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
        id = id.toString().substr(0,15);
        let query = 'insert into informacionpw2(id, tarjeta, vencimiento, cvv2, nombre, correoelectronico, monto, codigosucursal, identificador, boleta, montoboleta, fecha, codigotipopago, fechaconsulta, diaspagados) values '+
                    '('+"'"+id+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+correoelectronico+"'"+', '+"'"+Monto+"'"+', '+"'"+Sucursal+"'"+', '+"'"+Sucursal+"'"+','+"'"+boleta+"'"+','+"'"+montoboleta+"'"+', now(),'+ codigotipopago +",'"+fechac+"','"+diaspagados+"'"+')';
        con.connection.query(query, function (error, results, fields) {
            var array=({
                id : id,
                merchancity : env.parsed.merchant_city,
                merchanname : env.parsed.merchant_name,
                merchanid : env.parsed.merchant_id,
                correoEmpresa :env.parsed.correoelectronicousuario,
                correoserv : env.parsed.correoelectronicoservidor,
                correopass : env.parsed.correoelectronicocontrasena
            });
            resolve(array);
       });
    });
}
let Obteneridboletav1 = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,correoelectronico,Monto,Sucursal,boleta,montoboleta,codigotipopago,fechac,diaspagados,celular){

    return new Promise(function(resolve,reject){
        let Validate = 'SELECT * FROM `respuestaspw2` where boleta='+boleta+' AND CAST(fecha as DATE) = CAST(NOW() AS DATE)';
        con.connection.query(Validate, function (error, results, fields) {
            let resul = JSON.parse(JSON.stringify(results));
            if(!resul.length){
                var request = require('request');

                var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/consultapagoaplicado/"+boleta;  
                request(url, function (error, response, body) {


                    var res = JSON.parse(body);
                    res = res.data.response[0];
                    res = res ? res : undefined;
                    console.log(res);
                    if(res == undefined){
                        let id = uniqid.v4();
                        id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
                        id = id.toString().substr(0,15);
                        let query = 'insert into informacionpw2(id, tarjeta, vencimiento, cvv2, nombre, correoelectronico, monto, codigosucursal, identificador, boleta, montoboleta, fecha, codigotipopago, fechaconsulta, diaspagados, celular) values '+
                                    '('+"'"+id+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+correoelectronico+"'"+', '+"'"+Monto+"'"+', '+"'"+Sucursal+"'"+', '+"'"+Sucursal+"'"+','+"'"+boleta+"'"+','+"'"+montoboleta+"'"+', now(),'+ codigotipopago +",'"+fechac+"','"+diaspagados+"', '"+celular+"'"+')';
                        con.connection.query(query, function (error, results, fields) {
                            var array=({
                                id : id,
                                merchancity : env.parsed.merchant_city,
                                merchanname : env.parsed.merchant_name,
                                merchanid : env.parsed.merchant_id,
                                correoEmpresa :env.parsed.correoelectronicousuario,
                                correoserv : env.parsed.correoelectronicoservidor,
                                correopass : env.parsed.correoelectronicocontrasena
                            });
                            resolve(array);
                       });
                    }else{
                        var array=({
                            respuesta :'Pago en proceso'
                        });
        
                        resolve(array);
                    }
                });


 
            }else{
                var array=({
                    respuesta :'Pago en proceso'
                });

                resolve(array);
            }
       });

    });
}
let Obteneridboletav2 = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,correoelectronico,detalledepago,celular){
    let contador =0;
    return new Promise(function(resolve,reject){
            let res = '';
            let id = uniqid.v4();
            id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
            id = id.toString().substr(0,15);
            let detalle = JSON.parse(detalledepago);
            for(var i =0; i < detalle.length; i ++){    
                let idDetalle = uniqid.v4();
                idDetalle= idDetalle.toString().replace(/[^a-zA-Z0-9]/g, '');
                idDetalle = idDetalle.toString().substr(0,15);
                let query = 'insert into informacionpw2(idPrincipal ,id , tarjeta, vencimiento, cvv2, nombre, correoelectronico, monto, codigosucursal, identificador, boleta, montoboleta, fecha, codigotipopago, fechaconsulta, diaspagados, celular) values '+
                 '('+"'"+id+"'"+', '+"'"+idDetalle+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+correoelectronico+"'"+', '+"'"+detalle[i].Monto+"'"+', '+"'"+detalle[i].Sucursal+"'"+', '+"'"+detalle[i].Letra+"'"+','+"'"+detalle[i].Boleta+"'"+','+"'"+detalle[i].Prestamo+"'"+', now(),'+ detalle[i].Codigotipopago +",'"+detalle[i].Fechaconsulta+"','"+detalle[i].Diaspagados+"', '"+celular+"'"+')';
                 con.connection.query(query, function (error, results, fields) {
                 });
                 contador = contador + 1;
                }

            

                if(contador == detalle.length){
                    var array=({
                        id : id,
                        merchancity : env.parsed.merchant_city,
                        merchanname : env.parsed.merchant_name,
                        merchanid : env.parsed.merchant_id,
                        correoEmpresa :env.parsed.correoelectronicousuario,
                        correoserv : env.parsed.correoelectronicoservidor,
                        correopass : env.parsed.correoelectronicocontrasena
                    });
                    resolve(array);
                }
        });
}
let Obteneridboletamultiple = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,correoelectronico,detalledepago){
    return new Promise(function(resolve,reject){


    let id = uniqid.v4();
    id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
    id = id.toString().substr(0,15);
    let detalle = detalledepago;
    for(var i =0; i < detalle.length; i ++){    
        let idDetalle = uniqid.v4();
        idDetalle= idDetalle.toString().replace(/[^a-zA-Z0-9]/g, '');
        idDetalle = idDetalle.toString().substr(0,15);
        let query = 'insert into informacionpw2(idPrincipal ,id , tarjeta, vencimiento, cvv2, nombre, correoelectronico, monto, codigosucursal, identificador, boleta, montoboleta, fecha, codigotipopago, fechaconsulta, diaspagados) values '+
         '('+"'"+id+"'"+', '+"'"+idDetalle+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+correoelectronico+"'"+', '+"'"+detalle[i].monto+"'"+', '+"'"+detalle[i].sucursal+"'"+', '+"'"+detalle[i].letra+"'"+','+"'"+detalle[i].boleta+"'"+','+"'"+detalle[i].prestamo+"'"+', now(),'+ detalle[i].codigotipopago +",'"+detalle[i].fechaconsulta+"','"+detalle[i].diaspagados+"'"+')';
         con.connection.query(query, function (error, results, fields) {
            var array=({
                id : id,
                merchancity : env.parsed.merchant_city,
                merchanname : env.parsed.merchant_name,
                merchanid : env.parsed.merchant_id,
                correoEmpresa :env.parsed.correoelectronicousuario,
                correoserv : env.parsed.correoelectronicoservidor,
                correopass : env.parsed.correoelectronicocontrasena
            });
            resolve(array);
         });
        }


    });
}

let Obteneridboletamultiplev2 = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,correoelectronico,detalledepago, phoneNumber, typeCard, street, country, state, city, postalCode){
    return new Promise(function(resolve,reject){
    let id = uniqid.v4();
    id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
    id = id.toString().substr(0,15);
    let detalle = detalledepago;
    for(var i =0; i < detalle.length; i ++){    
        let idDetalle = uniqid.v4();
        idDetalle= idDetalle.toString().replace(/[^a-zA-Z0-9]/g, '');
        idDetalle = idDetalle.toString().substr(0,15);
        let query = 'insert into informacionpw2(idPrincipal ,id , tarjeta, vencimiento, cvv2, nombre, correoelectronico, monto, codigosucursal, identificador, boleta, montoboleta, fecha, codigotipopago, fechaconsulta, diaspagados, celular, typecard, street, country, state, city, postalcode) values '+
        '('+"'"+id+"'"+', '+"'"+idDetalle+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+correoelectronico+"'"+', '+"'"+detalle[i].monto+"'"+', '+"'"+detalle[i].sucursal+"'"+', '+"'"+detalle[i].letra+"'"+','+"'"+detalle[i].boleta+"'"+','+"'"+detalle[i].prestamo+"'"+', now(),'+ detalle[i].codigotipopago +",'"+detalle[i].fechaconsulta+"','"+detalle[i].diaspagados+"'"+",'"+phoneNumber+"'"+', '+"'"+typeCard+"'"+",'"+street+"'"+', '+"'"+country+"'"+",'"+state+"'"+', '+"'"+city+"'"+",'"+postalCode+"'"+')';
         con.connection.query(query, function (error, results, fields) {
             console.log(query)
            var array=({
                id : id,
                merchancity : env.parsed.merchant_city,
                merchanname : env.parsed.merchant_name,
                merchanid : env.parsed.merchant_id,
                correoEmpresa :env.parsed.correoelectronicousuario,
                correoserv : env.parsed.correoelectronicoservidor,
                correopass : env.parsed.correoelectronicocontrasena
            });
            resolve(array);
            
         });
        }

    });
}

let informacion3dsecure = async function datos(reference){
    return new Promise(function(resolve,reject){
        let query = 'SELECT * FROM informacion3dsecure where reference='+"'"+reference+"'";
            con.connection.query(query,function(error,results,fields){
                if(results){
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                }
                else{
                    resolve([]);
                }
            });
    });
}
let Obteneridboletav3 = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,correoelectronico,Monto,Sucursal,boleta,montoboleta,codigotipopago,fechac,diaspagados,PhoneNumber, typeCard, street, country, state, city, postalCode){

    return new Promise(function(resolve,reject){
        let Validate = 'SELECT * FROM `respuestaspw2` where boleta='+boleta+' AND CAST(fecha as DATE) = CAST(NOW() AS DATE)';
        con.connection.query(Validate, function (error, results, fields) {
            let resul = JSON.parse(JSON.stringify(results));
            if(!resul.length){
                var request = require('request');

                var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/consultapagoaplicado/"+boleta;  
                request(url, function (error, response, body) {
                    var res = JSON.parse(body);
                    res = res.data.response[0];
                    res = res ? res : undefined;
                    console.log(res);
                    if(res == undefined){
                        let id = uniqid.v4();
                        id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
                        id = id.toString().substr(0,15);
                        let query = 'insert into informacionpw2(idPrincipal, id, tarjeta, vencimiento, cvv2, nombre, correoelectronico, monto, codigosucursal, identificador, boleta, montoboleta, fecha, codigotipopago, fechaconsulta, diaspagados, celular, typecard, street, country, state, city, postalcode) values '+
                        '('+"'"+id+"'"+', '+"'"+id+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+correoelectronico+"'"+', '+"'"+Monto+"'"+', '+"'"+Sucursal+"'"+', '+"'"+Sucursal+"'"+','+"'"+boleta+"'"+','+"'"+montoboleta+"'"+', now(),'+ codigotipopago +",'"+fechac+"','"+diaspagados+"'"+",'"+PhoneNumber+"'"+', '+"'"+typeCard+"'"+",'"+street+"'"+', '+"'"+country+"'"+",'"+state+"'"+', '+"'"+city+"'"+",'"+postalCode+"'"+')';
                       console.log(query)
                                    con.connection.query(query, function (error, results, fields) {
                            var array=({
                                id : id,
                                merchancity : env.parsed.merchant_city,
                                merchanname : env.parsed.merchant_name,
                                merchanid : env.parsed.merchant_id,
                                correoEmpresa :env.parsed.correoelectronicousuario,
                                correoserv : env.parsed.correoelectronicoservidor,
                                correopass : env.parsed.correoelectronicocontrasena
                            });
                            resolve(array);
                       });
                    }else{
                        var array=({
                            respuesta :'Pago en proceso'
                        });
        
                        resolve(array);
                    }
                });


 
            }else{
                var array=({
                    respuesta :'Pago en proceso'
                });

                resolve(array);
            }
       });

    });
}

module.exports={
    Obteneridboleta,
    informacion3dsecure,
    Obteneridboletamultiple,
    Obteneridboletav1,
    Obteneridboletav3,
    Obteneridboletamultiplev2
}
