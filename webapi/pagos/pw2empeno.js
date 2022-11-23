const con = require("../../db/conexion");
const env = require('../../node_modules/dotenv').config({ path: '../../.env' });
const request = require('../../node_modules/request');
const querystring = require('../../node_modules/querystring');

let Obtenerdatosboletas = async function datos(referencia, eci, xid, cavv, status, cardtype) {
    return new Promise(function (resolve, reject) {
        if (status !== undefined) {
            let query = 'insert into informacion3dsecure(reference, eci, xid, cavv, status, cardtype) values ' +
                '(' + "'" + referencia + "'" + ', ' + "'" + eci + "'" + ', ' + "'" + xid + "'" + ', ' + "'" + cavv + "'" + ', ' + "'" + status + "'" + ', ' + "'" + cardtype + "'" + ')';
            con.connection.query(query, function (error, results, fields) {
                if (error) { reject(error) }
                let query2 = "SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal,i.boleta,CONCAT(s.correoelectronico,',',p.correoelectronicoparanotificacion) as correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago, i.fechaconsulta,i.diaspagados,i.celular FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.id inner join sucursales s on s.numero = i.codigosucursal inner join plazas p on p.codigo = s.ciudad where inf.reference=" + "'" + referencia + "'";
                con.connection.query(query2, function (error, results, fields) {
                    if (error) { reject(error) }
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                });
            });
        } else {
            let query = "SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal,i.boleta,CONCAT(s.correoelectronico,',',p.correoelectronicoparanotificacion) as correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago, i.fechaconsulta,i.diaspagados,i.celular FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.id inner join sucursales s on s.numero = i.codigosucursal inner join plazas p on p.codigo = s.ciudad where inf.reference=" + "'" + referencia + "'";
            con.connection.query(query, function (error, results, fields) {
                if (error) { reject(error) }
                Resultado = JSON.parse(JSON.stringify(results));
                var url = "https://grupoalvarez.com.mx:4430/maxilanaApp/api/consultapagoaplicado/" + Resultado[0].boleta;
                request(url, function (error, response, body) {
                    if (error) { reject(error) }
                    var res = JSON.parse(body);
                    res = res.data.response[0];
                    res = res ? res : undefined;
                    if (res == undefined) {
                        resolve(Resultado)
                    } else {
                        resolve(null)
                    }
                })
            });
        }
    });
}
let Obtenerdatosboletasv3 = async function datos(referencia) {
    return new Promise(function (resolve, reject) {
        let query = "SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal,i.boleta,CONCAT(s.correoelectronico,',',p.correoelectronicoparanotificacion) as correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago, i.fechaconsulta,i.diaspagados,i.celular FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.id inner join sucursales s on s.numero = i.codigosucursal inner join plazas p on p.codigo = s.ciudad where inf.reference=" + "'" + referencia + "'";
        con.connection.query(query, function (error, results, fields) {
            if (error) { reject(error) }
            Resultado = JSON.parse(JSON.stringify(results));
            var url = "https://grupoalvarez.com.mx:4430/maxilanaApp/api/consultapagoaplicado/" + Resultado[0].boleta;
            request(url, function (error, response, body) {
                if (error) { reject(error) }
                var res = JSON.parse(body);
                res = res.data.response[0];
                res = res ? res : undefined;
                if (res == undefined) {
                    resolve(Resultado)
                } else {
                    resolve(null)
                }
            })
        });

    });
}
let Obtenerdatosboletasv2 = async function datos(referencia, eci, xid, cavv, status, cardtype) {

    return new Promise(function (resolve, reject) {

        let query = 'SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal, i.boleta,p.correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago,s.correoelectronico as correosucursal, i.fechaconsulta,i.diaspagados FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.idPrincipal inner join sucursales s on s.numero = i.codigosucursal inner join ciudades c on c.id=s.ciudad inner join plazas p on p.codigo=c.codigoplaza where inf.reference=' + "'" + referencia + "'";
        con.connection.query(query, function (error, results, fields) {
            if (error) { reject(error) }
            Resultado = JSON.parse(JSON.stringify(results));
            resolve(Resultado)
        });


    });
}
let ObtenerdatosboletasPrueba = async function datos(referencia, eci, xid, cavv, status, cardtype) {
    return new Promise(function (resolve, reject) {
        if (status !== undefined) {
            let query = 'insert into informacion3dsecure(reference, eci, xid, cavv, status, cardtype) values ' +
                '(' + "'" + referencia + "'" + ', ' + "'" + eci + "'" + ', ' + "'" + xid + "'" + ', ' + "'" + cavv + "'" + ', ' + "'" + status + "'" + ', ' + "'" + cardtype + "'" + ')';
            con.connection.query(query, function (error, results, fields) {
                if (error) { reject(error) }
                let query2 = 'SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal, i.boleta,p.correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago,s.correoelectronico as correosucursal, i.fechaconsulta,i.diaspagados FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.idPrincipal inner join sucursales s on s.numero = i.codigosucursal inner join ciudades c on c.id=s.ciudad inner join plazas p on p.codigo=c.codigoplaza where inf.reference=' + "'" + referencia + "'";
                con.connection.query(query2, function (error, results, fields) {
                    if (error) { reject(error) }
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                });
            });
        } else {
            const kk = `
            SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,
            i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal, 
            i.boleta,p.correoelectronicoparanotificacion,
            inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,
            s.nombre as sucnom,i.fecha,i.codigotipopago,
            s.correoelectronico as correosucursal, i.fechaconsulta,
            i.diaspagados 
            FROM informacionpw2 i 
            inner join informacion3dsecure inf on inf.reference=i.idPrincipal 
            inner join sucursales s on s.numero = i.codigosucursal 
            inner join ciudades c on c.id=s.ciudad 
            inner join plazas p on p.codigo=c.codigoplaza 
            where i.boleta like '${referencia}%'`
            
            let query = 'SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal, i.boleta,p.correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago,s.correoelectronico as correosucursal, i.fechaconsulta,i.diaspagados FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.idPrincipal inner join sucursales s on s.numero = i.codigosucursal inner join ciudades c on c.id=s.ciudad inner join plazas p on p.codigo=c.codigoplaza where inf.reference=' + "'" + referencia + "'";
            con.connection.query(query, function (error, results, fields) {
                if (error) { reject(error) }
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado)
            });
        }
    });
}
let prueba = async function datos(referencia) {
    return new Promise(function (resolve, reject) {
        const query = `
            SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, 
            i.correoelectronico, i.codigosucursal, i.boleta,
            p.correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,
            inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago,
            s.correoelectronico as correosucursal, i.fechaconsulta,i.diaspagados 
            FROM informacionpw2 i 
            inner join informacion3dsecure inf on inf.reference = i.idPrincipal 
            inner join sucursales s on s.numero = i.codigosucursal 
            inner join ciudades c on c.id = s.ciudad 
            inner join plazas p on p.codigo = c.codigoplaza 
            where inf.reference='${referencia}'
        `;
        //let query = 'SELECT i.id,i.idPrincipal,i.monto,i.tarjeta,i.vencimiento,i.cvv2 as ccv2, i.correoelectronico, i.codigosucursal, i.boleta,p.correoelectronicoparanotificacion,inf.cardtype,inf.status,inf.cavv,inf.xid,inf.eci,s.nombre as sucnom,i.fecha,i.codigotipopago,s.correoelectronico as correosucursal, i.fechaconsulta,i.diaspagados FROM `informacionpw2` i inner join informacion3dsecure inf on inf.reference=i.idPrincipal inner join sucursales s on s.numero = i.codigosucursal inner join ciudades c on c.id=s.ciudad inner join plazas p on p.codigo=c.codigoplaza where inf.reference=' + "'" + referencia + "'";
        con.connection.query(query, function (error, results, fields) {
            if (error) { reject(error) }
            Resultado = JSON.parse(JSON.stringify(results));
            resolve(Resultado)
        });
    });
}
let ejecutarcobrov2 = async function venta(vencimiento, ccv, tarjeta, Monto, id, status, eci, xid, cavv) {

    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + id;

        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv
        };
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            resolve(response.headers);
        });
    });
}
let ejecutarcobrov3 = async function venta(vencimiento, ccv, tarjeta, Monto, sucursal, id, status, eci, xid, cavv) {

    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + id;

        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv
        };
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            resolve(response.headers);
        });
    });
}
let ejecutarcobro = async function venta(vencimiento, ccv, tarjeta, Monto, sucursal, id, status, eci, xid, cavv) {

    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + id;

        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv
        };
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            resolve(response.headers);
        });
    });
}
let ejecutarcobrov1 = async function venta(vencimiento, ccv, tarjeta, Monto, sucursal, id, status, eci, xid, cavv) {

    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + id;

        var myJSONObject = {
            MERCHANT_ID: "8279402",
            USER: 'e8279402',
            PASSWORD: 'X=a6p$1M',
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: '82794021',
            // MERCHANT_ID   : env.parsed.merchant_id,
            // USER          : env.parsed.user,
            // PASSWORD      : env.parsed.password,
            // CMD_TRANS     : 'AUTH',
            // TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv
        };
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            resolve(response.headers);
        });
    });
}
let ejecutarcobroprueba = async function venta(vencimiento, ccv, tarjeta, Monto, boleta, status, eci, xid, cavv) {
    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + Math.floor(boleta);

        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv
        };
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            resolve(response.headers);
        });
    });
}
let ejecutarcobropruebav1 = async function venta(vencimiento, ccv, tarjeta, Monto, boleta, status, eci, xid, cavv) {
    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + Math.floor(boleta);;

        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv
        };
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            resolve(response.headers);
        });
    });
}
let ejecutarcobrov4 = async function venta(vencimiento, ccv, tarjeta, Monto, sucursal, id, status, eci, xid, cavv) {

    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + id;

        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv,
            VERSION_3D: 2

        };
        let Dataxid = myJSONObject.XID;
        let Datacavv = myJSONObject.CAVV;
        if (!Dataxid || Dataxid == 'null') {
            delete myJSONObject.XID;
        }
        if (!Datacavv || Datacavv == 'null') {
            delete myJSONObject.CAVV;
        }
        console.log(myJSONObject);
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) };
            console.log(response.headers);
            resolve(response.headers);
        });
    });
}
let ejecutarcobrov5 = async function venta(vencimiento, ccv, tarjeta, Monto, boleta, status, eci, xid, cavv) {
    let total = parseFloat(Monto).toFixed(2);

    return new Promise(function (resolve, reject) {
        var referencia = 'R-' + Math.floor(boleta);

        var myJSONObject = {
            // MERCHANT_ID: "8279402",
            // USER: 'e8279402',
            // PASSWORD: 'X=a6p$1M',
            // CMD_TRANS: 'AUTH',
            // TERMINAL_ID: '82794021',
            MERCHANT_ID   : env.parsed.merchant_id,
            USER          : env.parsed.user,
            PASSWORD      : env.parsed.password,
            CMD_TRANS     : 'AUTH',
            TERMINAL_ID   :  env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'PRD',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CARD_NUMBER: tarjeta,
            CARD_EXP: vencimiento,
            SECURITY_CODE: ccv,
            ENTRY_MODE: 'MANUAL',
            STATUS_3D: status,
            ECI: eci,
            XID: xid,
            CAVV: cavv,
            VERSION_3D: 2
        };
        let Dataxid = myJSONObject.XID;
        let Datacavv = myJSONObject.CAVV;
        if (!Dataxid || Dataxid == 'null') {
            delete myJSONObject.XID;
        }
        if (!Datacavv || Datacavv == 'null') {
            delete myJSONObject.CAVV;
        }
        var data = querystring.stringify(myJSONObject);
        var request = require('request');
        request.post({
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            url: 'https://via.pagosbanorte.com/payw2',
            body: data
        }, function (error, response, body) {
            if (error) { reject(error) }
            resolve(response.headers);
        });
    });
}
module.exports = {
    Obtenerdatosboletas,
    ejecutarcobro,
    ejecutarcobrov1,
    ejecutarcobroprueba,
    ObtenerdatosboletasPrueba,
    prueba,
    ejecutarcobropruebav1,
    Obtenerdatosboletasv2,
    ejecutarcobrov2,
    ejecutarcobrov3,
    Obtenerdatosboletasv3,
    ejecutarcobrov4,
    ejecutarcobrov5
}
