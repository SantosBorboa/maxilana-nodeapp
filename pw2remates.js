const con = require("../../db/conexion");
const env = require('../../node_modules/dotenv').config({ path: '../../.env' });
const request = require('../../node_modules/request');
const querystring = require('../../node_modules/querystring');
let Obtenerdatos = async function datos(referencia,eci,xid,cavv,status,cardtype){

        return new Promise(function(resolve,reject){
            if(status !== undefined){
                let query = 'insert into informacion3dsecure(reference, eci, xid, cavv, status, cardtype) values '+
                '('+"'"+referencia+"'"+', '+"'"+eci+"'"+', '+"'"+xid+"'"+', '+"'"+cavv+"'"+', '+"'"+status+"'"+', '+"'"+cardtype+"'"+')';
                con.connection.query(query,function(error,results,fields){
                    let query2 = 'select i.id, tarjeta, vencimiento, ccv2, monto, i.codigosucursal,suc.nombre as nombresucursal, i.upc, s.eci,s.xid,s.cavv,s.status,s.cardtype,e.nombre,e.celular,e.correoelectronico,e.direccion,e.codigopostal,e.colonia,e.municipio,e.municipio,e.estado,e.fecha,e.instrucciones,p.correoparaconfirmaciondecompra,a.nombre as articulo,a.precioneto,suc.correoelectronico as correosucursal from informacionTransaccionVentas i inner join informacion3dsecure s on s.reference = i.id inner join informacionEnvioArticulos e on e.id = i.id inner join sucursales suc on suc.numero=i.codigosucursal inner join plazas p on p.codigo=suc.ciudad inner join remates a on a.codigo = i.upc where i.id ='+"'"+referencia+"'";
                    con.connection.query(query2, function (error, results, fields) {
                        Resultado = JSON.parse(JSON.stringify(results));
                        resolve(Resultado)
                     });;
                });
            }else{
                let query = 'select i.id, tarjeta, vencimiento, ccv2, monto, i.codigosucursal,suc.nombre as nombresucursal, i.upc, s.eci,s.xid,s.cavv,s.status,s.cardtype,e.nombre,e.celular,e.correoelectronico,e.direccion,e.codigopostal,e.colonia,e.municipio,e.municipio,e.estado,e.fecha,e.instrucciones,p.correoparaconfirmaciondecompra,a.nombre as articulo,a.precioneto,suc.correoelectronico as correosucursal from informacionTransaccionVentas i inner join informacion3dsecure s on s.reference = i.id inner join informacionEnvioArticulos e on e.id = i.id inner join sucursales suc on suc.numero=i.codigosucursal inner join plazas p on p.codigo=suc.ciudad inner join remates a on a.codigo = i.upc where i.id ='+"'"+referencia+"'";
                con.connection.query(query, function (error, results, fields) {
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                 });;
            }
    
        });
}
let Obtenerdatosv2 = async function datos(referencia){

    return new Promise(function(resolve,reject){

            let query = 'select i.id, tarjeta, vencimiento, ccv2, monto, i.codigosucursal,suc.nombre as nombresucursal, i.upc, s.eci,s.xid,s.cavv,s.status,s.cardtype,e.nombre,e.celular,e.correoelectronico,e.direccion,e.codigopostal,e.colonia,e.municipio,e.municipio,e.estado,e.fecha,e.instrucciones,p.correoparaconfirmaciondecompra,a.nombre as articulo,a.precioneto,suc.correoelectronico as correosucursal from informacionTransaccionVentas i inner join informacion3dsecure s on s.reference = i.id inner join informacionEnvioArticulos e on e.id = i.id inner join sucursales suc on suc.numero=i.codigosucursal inner join plazas p on p.codigo=suc.ciudad inner join remates a on a.codigo = i.upc where i.id ='+"'"+referencia+"'";
            con.connection.query(query, function (error, results, fields) {
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado)
             });;
        });
}

let Obtenerdatosmultiple = async function datos(referencia,eci,xid,cavv,status,cardtype){

    return new Promise(function(resolve,reject){
        if(status !== undefined){
            let query = 'insert into informacion3dsecure(reference, eci, xid, cavv, status, cardtype) values '+
            '('+"'"+referencia+"'"+', '+"'"+eci+"'"+', '+"'"+xid+"'"+', '+"'"+cavv+"'"+', '+"'"+status+"'"+', '+"'"+cardtype+"'"+')';
            con.connection.query(query,function(error,results,fields){
                let query2 = 'select i.id,i.idPrincipal, tarjeta, vencimiento, ccv2,a.precio , monto, i.codigosucursal, i.upc, s.eci,s.xid,s.cavv,s.status,s.cardtype,e.nombre,e.celular,e.correoelectronico,e.direccion,e.codigopostal,e.colonia,e.municipio,e.municipio,e.estado,e.fecha,e.instrucciones,p.correoparaconfirmaciondecompra,a.nombre as articulo,suc.correoelectronico as correosucursal from informacionTransaccionVentas i inner join informacion3dsecure s on s.reference = i.idPrincipal inner join informacionEnvioArticulos e on e.id = i.idPrincipal inner join sucursales suc on suc.numero=i.codigosucursal inner join plazas p on p.codigo=suc.ciudad inner join remates a on a.codigo = i.upc where i.idPrincipal='+"'"+referencia+"'";
                con.connection.query(query2, function (error, results, fields) {
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                 });;
            });
        }else{
            let query = 'select i.id,i.idPrincipal, tarjeta, vencimiento, ccv2,a.precio , monto, i.codigosucursal, i.upc, s.eci,s.xid,s.cavv,s.status,s.cardtype,e.nombre,e.celular,e.correoelectronico,e.direccion,e.codigopostal,e.colonia,e.municipio,e.municipio,e.estado,e.fecha,e.instrucciones,p.correoparaconfirmaciondecompra,a.nombre as articulo,suc.correoelectronico as correosucursal from informacionTransaccionVentas i inner join informacion3dsecure s on s.reference = i.idPrincipal inner join informacionEnvioArticulos e on e.id = i.idPrincipal inner join sucursales suc on suc.numero=i.codigosucursal inner join plazas p on p.codigo=suc.ciudad inner join remates a on a.codigo = i.upc where i.idPrincipal='+"'"+referencia+"'";
            con.connection.query(query, function (error, results, fields) {
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado)
             });;
        }

    });
}
let ejecutarventav2 = async function venta(vencimiento,ccv,tarjeta,Monto,Sucursal,upc,status,eci,xid,cavv){

    let total  = parseFloat(Monto).toFixed(2);

    return new Promise(function(resolve,reject){

        var referencia = 'V' +Sucursal + '-' +Math.floor(upc);;
        var myJSONObject={
            MERCHANT_ID   :"8279402",
            USER          : "e8279402",
            PASSWORD      : "X=a6p$1M",
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  "82794021",
            AMOUNT        : total,
            MODE          : 'AUT',  //DEC PRD AUT
            CUSTOMER_REF2 : referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER   : tarjeta,
            CARD_EXP      : vencimiento,
            SECURITY_CODE : ccv,
            ENTRY_MODE    : 'MANUAL',
            STATUS_3D     : status,
            ECI           : eci,
            XID           : xid,
            CAVV          : cavv
        };
        
       
        var data = querystring.stringify(myJSONObject);
            var request = require('request');
            request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://via.pagosbanorte.com/payw2',
            body:    data
            }, function(error, response, body){
              resolve(response.headers);
            });
    });
}
let ejecutarventav1 = async function venta(vencimiento,ccv,tarjeta,Monto,Sucursal,upc,status,eci,xid,cavv){

    let total  = parseFloat(Monto).toFixed(2);

    return new Promise(function(resolve,reject){

        var referencia = 'V' +Sucursal + '-' +Math.floor(upc);;
        var myJSONObject={
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT        : total,
            MODE          : 'DEC',  //DEC PRD AUT
            CUSTOMER_REF2 : referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER   : tarjeta,
            CARD_EXP      : vencimiento,
            SECURITY_CODE : ccv,
            ENTRY_MODE    : 'MANUAL',
            STATUS_3D     : status,
            ECI           : eci,
            XID           : xid,
            CAVV          : cavv
        };
        
       
        var data = querystring.stringify(myJSONObject);
            var request = require('request');
            request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://via.pagosbanorte.com/payw2',
            body:    data
            }, function(error, response, body){
              resolve(response.headers);
            });
    });
}
let ejecutarventa = async function venta(vencimiento,ccv,tarjeta,Monto,Sucursal,upc,status,eci,xid,cavv){

    let total  = parseFloat(Monto).toFixed(2);

    return new Promise(function(resolve,reject){

        var referencia = 'V' +Sucursal + '-' +Math.floor(upc);;
        var myJSONObject={
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT        : total,
            MODE          : 'DEC',  //DEC PRD AUT
            CUSTOMER_REF2 : referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER   : tarjeta,
            CARD_EXP      : vencimiento,
            SECURITY_CODE : ccv,
            ENTRY_MODE    : 'MANUAL',
            STATUS_3D     : status,
            ECI           : eci,
            XID           : xid,
            CAVV          : cavv
        };
        
       
        var data = querystring.stringify(myJSONObject);
            var request = require('request');
            request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://via.pagosbanorte.com/payw2',
            body:    data
            }, function(error, response, body){
              resolve(response.headers);
            });
    });
}
let ejecutarcobromultiple = async function venta(vencimiento,ccv,tarjeta,Monto,upc,status,eci,xid,cavv){
    let total  = parseFloat(Monto).toFixed(2);
    console.log(total)
    return new Promise(function(resolve,reject){
        var referencia = 'V-' +Math.floor(upc);;
        
        var myJSONObject={
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT        : total,
            MODE          : 'DEC',  //DEC PRD AUT
            CUSTOMER_REF2 : referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER   : tarjeta,
            CARD_EXP      : vencimiento,
            SECURITY_CODE : ccv,
            ENTRY_MODE    : 'MANUAL',
            STATUS_3D     : status,
            ECI           : eci,
            XID           : xid,
            CAVV          : cavv
        };
        var data = querystring.stringify(myJSONObject);
            var request = require('request');
            request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://via.pagosbanorte.com/payw2',
            body:    data
            }, function(error, response, body){
              resolve(response.headers);
            });
    });
}

let ejecutarventaprueba = async function venta(vencimiento,ccv,tarjeta,Monto,Sucursal,upc,status,eci,xid,cavv){

    let total  = parseFloat(Monto).toFixed(2);

    return new Promise(function(resolve,reject){

        var referencia = 'V' +Sucursal + '-' +Math.floor(upc);;
        var myJSONObject={
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT        : total,
            MODE          : 'DEC',  //DEC PRD AUT
            CUSTOMER_REF2 : referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER   : tarjeta,
            CARD_EXP      : vencimiento,
            SECURITY_CODE : ccv,
            ENTRY_MODE    : 'MANUAL',
            STATUS_3D     : status,
            ECI           : eci,
            XID           : xid,
            CAVV          : cavv
        };
        
       
        var data = querystring.stringify(myJSONObject);
            var request = require('request');
            request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://via.pagosbanorte.com/payw2',
            body:    data
            }, function(error, response, body){
              resolve(response.headers);
            });
    });
}

module.exports={
    Obtenerdatos,
    Obtenerdatosv2,
    ejecutarventa,
    ejecutarventaprueba,
    Obtenerdatosmultiple,
    ejecutarcobromultiple,
    ejecutarventav1,
    ejecutarventav2
}
