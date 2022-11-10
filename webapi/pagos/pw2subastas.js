const con = require("../../db/conexion");
const env = require('../../node_modules/dotenv').config({ path: '../../.env' });
const request = require('../../node_modules/request');
const querystring = require('../../node_modules/querystring');
let Obtenerdatos = async function datos(referencia){
        return new Promise(function(resolve,reject){
                    let query2 = 'select f_id as UniqId,control_number , f_num_1 as Monto, f_num_2 as referencia, f_num_3 as tarjeta, f_num_4 as vencimiento, f_num_5 as ccv, f_num_6 as status, f_num_7 as eci, f_num_8 as xid, f_num_9 as cavv from tmp_infopw2 where f_id='+"'"+referencia+"'";
                    console.log(query2);
                    con.connectionsubastas.query(query2, function (error, results, fields) {
                            console.log(results)
                            console.log(error);
                            Resultado = JSON.parse(JSON.stringify(results));
                            resolve(Resultado)
                     });;
        });
}
let ejecutarPago = async function ejecutar(Monto, referencia,tarjeta,vencimiento,ccv,status,eci,xid,cavv,control_number,lotID){
    let total  = parseFloat(Monto).toFixed(2);

    return new Promise(function(resolve,reject){
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
        /*
        var myJSONObject={
            MERCHANT_ID   : '8279402',
            USER          : 'e8279402',
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
        };*/
       
        var data = querystring.stringify(myJSONObject);
            var request = require('request');
            request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            url:     'https://via.pagosbanorte.com/payw2',
            body:    data
            }, function(error, response, body){
                var i = response.headers;
                let query = 'insert into respuestapw2(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,tarjeta,monto,enviado,idLote) values '+
                '('+"'"+i.referencia+"'"+', '+"'"+control_number+"'"+', '+"'"+i.fecha_req_cte+"'"+', '+"''"+', '+"''"+', '+"'"+i.fecha_rsp_cte+"'"+', '+"'"+i.resultado_payw+"'"+', '+"''"+', '+"''"+', '+"'"+i.codigo_aut+"'"+', '+"'"+i.texto+"'"+', '+"''"+', '+"''"+', '+"''"+', '+"''"+', '+"'"+tarjeta+"'"+', '+"'"+Monto+"'"+',0,"'+lotID+'")';
                console.log(query);
                con.connectionsubastas.query(query, function (error, results, fields) {
                    resolve(response.headers);
                 });;
            });
    });
}
module.exports = {
    Obtenerdatos,
    ejecutarPago
} ;