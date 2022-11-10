const con = require("../../db/conexion");
const env = require('../../node_modules/dotenv').config({ path: '../../.env' });
const request = require('../../node_modules/request');
const querystring = require('../../node_modules/querystring');
let Obtenerdatos = async function datos(Referencia,eci,xid,cavv,status,cardtype){
        return new Promise(function(resolve,reject){
            if(status !== undefined){
                let query1 = 'insert into informacion3dsecure(reference, eci, xid, cavv, status, cardtype) values '+
                '('+"'"+Referencia+"'"+', '+"'"+eci+"'"+', '+"'"+xid+"'"+', '+"'"+cavv+"'"+', '+"'"+status+"'"+', '+"'"+cardtype+"'"+')';
                con.connection.query(query1,function(error,results,fields){
                    let query = 'select p.id, tarjeta,p.correoelectronico ,vencimiento, cvv2, monto , codigosucursal, codigoprestamo, esvale, fecha, s.cardtype, s.cavv, s.status,s.xid, s.eci, p.celular from informacionpp_pw2 p inner join informacion3dsecure s on p.id  = s.reference where p.id='+"'"+Referencia+"'";
                    con.connection.query(query, function (error, results, fields) {
                        Resultado = JSON.parse(JSON.stringify(results));
                        resolve(Resultado)
                     });;
                });
            }else{
                let query = 'select p.id, tarjeta,p.correoelectronico ,vencimiento, cvv2, monto , codigosucursal, codigoprestamo, esvale, fecha, s.cardtype, s.cavv, s.status,s.xid, s.eci, p.celular from informacionpp_pw2 p inner join informacion3dsecure s on p.id  = s.reference where p.id='+"'"+Referencia+"'";
                con.connection.query(query, function (error, results, fields) {
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                 });;
            }
        }); 
}
let ejecutarventa = async function venta(vencimiento,ccv,tarjeta,Monto,sucursal,codigoprestamo,status,eci,xid,cavv,opcion){

    let total  = parseFloat(Monto).toFixed(2);
    let referencia = "";
    return new Promise(function(resolve,reject){
        if(opcion == 1){
            referencia = "PP-"+sucursal+"-"+codigoprestamo;
        }else{
            referencia = "PV-"+codigoprestamo;
        }
        var myJSONObject={
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT        : total,
            MODE          : 'PRD',  //DEC PRD AUT
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
let ejecutarventav1 = async function venta(vencimiento,ccv,tarjeta,Monto,sucursal,codigoprestamo,status,eci,xid,cavv,opcion){

    let total  = parseFloat(Monto).toFixed(2);
    let referencia = "";
    return new Promise(function(resolve,reject){
        if(opcion == 1){
            referencia = "PP-"+sucursal+"-"+codigoprestamo;
        }else{
            referencia = "PV-"+codigoprestamo;
        }
        var myJSONObject={
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT        : total,
            MODE          : 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2 : referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER   : tarjeta,
            CARD_EXP      : vencimiento,
            SECURITY_CODE : ccv,
            ENTRY_MODE    : 'MANUAL',
            STATUS_3D     : status,
            ECI           : eci,
            XID           : xid,
            CAVV          : cavv,
            VERSION_3D    : 2
        };
        
        let Dataxid  = myJSONObject.XID;
        let Datacavv  = myJSONObject.CAVV;
        if(!Dataxid || Dataxid == 'null'){
            delete myJSONObject.XID;
        }
        if(!Datacavv || Datacavv == 'null'){
            delete myJSONObject.CAVV;
        }
       
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
    ejecutarventa,
    ejecutarventav1
}
