const sql = require("../../node_modules/mssql");
const con = require("../../db/conexion");
const email = require("../emails/sendemailremate");
const request = require("request");
const soap = require("../../node_modules/soap");
const libsodium = require("../../webapi/libsodium/libsodium");
const _sodium = require('../../node_modules/libsodium-wrappers');
const conexion = con.sqlconnection;
let grabardatos = async function datos(reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, correoelectronico, monto, codigosucursal, upc, costoenvio, precioneto, seguro, clickcollect) {
    var Montototal = (parseFloat(monto) - parseFloat(costoenvio));
    Montototal = (parseFloat(Montototal) - parseFloat(seguro))
    tarjeta = tarjeta.substr(-4);
    return new Promise(function (resolve, reject) {
        var url = "api/grabarpagoreamtes/reference/" + reference + "/control_number/" + control_number + "/cust_req_date/" + cust_req_date + "/auth_req_date/" + auth_req_date + "/auth_rsp_date/" + auth_rsp_date + "/cust_rsp_date/" + cust_rsp_date + "/payw_result/" + payw_result + "/auth_result/" + auth_result + "/payw_code/" + payw_code + "/auth_code/" + auth_code + "/text/" + text + "/card_holder/" + card_holder + "/ussuing_bank/" + ussuing_bank + "/card_brand/" + card_brand + "/card_type/" + card_type + "/tarjeta/" + tarjeta + "/correoelectronico/" + correoelectronico + "/monto/" + Montototal + "/codigosucursal/" + codigosucursal + "/upc/" + upc + "/correoenviado/0/costoenvio/" + costoenvio + "/precio/" + precioneto + "/esapp/1/costoseguro/" + seguro;
        request('http://grupoalvarez.com.mx:8089/maxilanaApp/' + url, function (error, response, body) {
            var response = JSON.parse(body);
            var data = response.data;
            reference = reference ? reference : null;
            control_number = control_number ? control_number : null;
            cust_req_date = cust_req_date ? cust_req_date : null;
            auth_req_date = auth_req_date ? auth_req_date : null;
            auth_rsp_date = auth_rsp_date ? auth_rsp_date : null;
            cust_rsp_date = cust_rsp_date ? cust_rsp_date : null;
            payw_result = payw_result ? payw_result : null;
            auth_result = auth_result ? auth_result : null;
            payw_code = payw_code ? payw_code : null;
            auth_code = auth_code ? auth_code : null;
            text = text ? text : null;
            card_holder = card_holder ? card_holder : null;
            ussuing_bank = ussuing_bank ? ussuing_bank : null;
            card_brand = card_brand ? card_brand : null;
            card_type = card_type ? card_type : null;
            tarjeta = tarjeta ? tarjeta : null;
            correoelectronico = correoelectronico ? correoelectronico : null;
            monto = monto ? monto : null;
            codigosucursal = codigosucursal ? codigosucursal : null;
            upc = upc ? upc : null;
            let query = 'insert into respuestaspw2remates(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,ussuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,upc,enviado) values ' +
                '(' + "'" + reference + "'" + ', ' + "'" + control_number + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + correoelectronico + "'" + ', ' + "'" + monto + "'" + ',' + "'" + codigosucursal + "'" + ',' + "'" + upc + "'" + ',0)';
            con.connection.query(query, function (error, results, fields) {
                let query3 = 'SELECT * FROM articulodelmesapp WHERE codigo=' + "'" + upc + "'";
                con.connection.query(query3, function (error, results, fields) {
                    if (results != undefined) {
                        let query2 = 'update from articulodelmesapp set codigo=""';
                        con.connection.query(query2, function (error, results, fields) {
                            resolve(data.response[0]);
                        });
                    } else {
                        resolve(data.response[0]);
                    }
                });
            })

            let aplicarpago = 'https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia=' + reference + '&CodigoOperacion=2';
            request.post(aplicarpago, function (error, response, body) { console.log(body) });
        });
    });
}
let grabardatosremates = async function datos(reference, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, pagodetail, esapp, orden) {
    //   var conn = new sql.ConnectionPool(conexion);
    var cnt = 0;
    tarjeta = tarjeta.substr(-4);
    let detalle = pagodetail;
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < detalle.length; i++) {
            url = "";
            reference = reference ? reference : null;
            control_number = detalle[i].id ? detalle[i].id : null;
            cust_req_date = cust_req_date ? cust_req_date : null;
            auth_req_date = auth_req_date ? auth_req_date : null;
            auth_rsp_date = auth_rsp_date ? auth_rsp_date : null;
            cust_rsp_date = cust_rsp_date ? cust_rsp_date : null;
            payw_result = payw_result ? payw_result : null;
            auth_result = auth_result ? auth_result : null;
            payw_code = payw_code ? payw_code : null;
            auth_code = auth_code ? auth_code : null;
            text = text ? text : null;
            card_holder = card_holder ? card_holder : null;
            ussuing_bank = ussuing_bank ? ussuing_bank : null;
            card_brand = card_brand ? card_brand : null;
            card_type = card_type ? card_type : null;
            correo = detalle[i].correoelectronico ? detalle[i].correoelectronico : null;
            monto = detalle[i].monto ? detalle[i].monto : null;
            upc = detalle[i].upc ? detalle[i].upc : null;
            codigosucursal = detalle[i].codigosucursal ? detalle[i].codigosucursal : null;
            precioetiqueta = detalle[i].precio ? detalle[i].precio : 0;
            var costoenvio = 0;
            var costoseguro = 0;
            console.log(upc + " paso :" + i);
            for (var j = 0; j < orden.carrito.length; j++) {
                for (var l = 0; l < orden.carrito[j].productos.length; l++) {
                    var codigo = orden.carrito[j].productos[l].id;
                    if (codigo == upc) {
                        costoenvio = orden.carrito[j].productos[l].envio;
                        costoseguro = orden.carrito[j].productos[l].seguro;
                    }
                }
            }

            url = "api/grabarpagoreamtes/reference/" + reference + "/control_number/" + control_number + "/cust_req_date/" + cust_req_date + "/auth_req_date/" + auth_req_date + "/auth_rsp_date/" + auth_rsp_date + "/cust_rsp_date/" + cust_rsp_date + "/payw_result/" + payw_result + "/auth_result/" + auth_result + "/payw_code/" + payw_code + "/auth_code/" + auth_code + "/text/" + text + "/card_holder/" + card_holder + "/ussuing_bank/" + ussuing_bank + "/card_brand/" + card_brand + "/card_type/" + card_type + "/tarjeta/" + tarjeta + "/correoelectronico/" + correo + "/monto/" + monto + "/codigosucursal/" + codigosucursal + "/upc/" + upc + "/correoenviado/0/costoenvio/" + costoenvio + "/precio/" + precioetiqueta + "/esapp/0/costoseguro/" + costoseguro;
            let query = 'insert into respuestaspw2remates(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,ussuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,upc,enviado) values ' + ' (' + "'" + reference + "'" + ', ' + "'" + control_number + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + correo + "'" + ', ' + "'" + monto + "'" + ',' + "'" + codigosucursal + "'" + ',' + "'" + upc + "'" + ',0)';

            request('http://grupoalvarez.com.mx:8089/maxilanaApp/' + url, function (error, response, body) {
                cnt = cnt + 1;
                con.connection.query(query, function (error, results, fields) {
                    let aplicarpago = 'https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia=' + reference + '&CodigoOperacion=2';
                    console.log(aplicarpago)
                    // request.post(aplicarpago,function(error,response,body){
                    let respuesta = {
                        respuesta: true
                    }
                    resolve(respuesta);
                 });

            });

        }




    });
}

let grabardatosempenov3 = async function datos(reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, correoelectronico, monto, codigosucursal, boleta, fechaConsulta, codigotipopago, dias, aplicarcomision) {
    var conn = new sql.ConnectionPool(conexion);
    tarjeta = tarjeta.substr(-4);
    return new Promise(function (resolve, reject) {
        var url = "api/grabarpagoboleta/reference/" + reference + "/control_number/" + control_number + "/cust_req_date/" + cust_req_date + "/auth_req_date/" + auth_req_date + "/auth_rsp_date/" + auth_rsp_date + "/cust_rsp_date/" + cust_rsp_date + "/payw_result/" + payw_result + "/auth_result/" + auth_result + "/payw_code/" + payw_code + "/auth_code/" + auth_code + "/text/" + text + "/card_holder/" + card_holder + "/ussuing_bank/" + ussuing_bank + "/card_brand/" + card_brand + "/card_type/" + card_type + "/tarjeta/" + tarjeta + "/correoelectronico/" + correoelectronico + "/monto/" + monto + "/codigosucursal/" + codigosucursal + "/boleta/" + boleta + "/correoenviado/0/fechaConsulta/" + fechaConsulta + "/ctpago/" + codigotipopago + "/dias/" + dias + "/esapp/1/aplicacomision/" + aplicarcomision;
        console.log(url);
        request('http://grupoalvarez.com.mx:8089/maxilanaApp/' + url, function (error, response, body) {
            var response = JSON.parse(body);
            var data = response.data;
            reference = reference ? reference : null;
            control_number = control_number ? control_number : null;
            cust_req_date = cust_req_date ? cust_req_date : null;
            auth_req_date = auth_req_date ? auth_req_date : null;
            auth_rsp_date = auth_rsp_date ? auth_rsp_date : null;
            cust_rsp_date = cust_rsp_date ? cust_rsp_date : null;
            payw_result = payw_result ? payw_result : null;
            auth_result = auth_result ? auth_result : null;
            payw_code = payw_code ? payw_code : null;
            auth_code = auth_code ? auth_code : null;
            text = text ? text : null;
            card_holder = card_holder ? card_holder : null;
            ussuing_bank = ussuing_bank ? ussuing_bank : null;
            card_brand = card_brand ? card_brand : null;
            card_type = card_type ? card_type : null;
            tarjeta = tarjeta ? tarjeta : null;
            correoelectronico = correoelectronico ? correoelectronico : null;
            monto = monto ? monto : null;
            codigosucursal = codigosucursal ? codigosucursal : null;
            boleta = boleta ? boleta : null;
            let query = 'insert into respuestaspw2(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,boleta,enviado,aplicacomision) values ' +
                '(' + "'" + reference + "'" + ', ' + "'" + control_number + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + correoelectronico + "'" + ', ' + "'" + monto + "'" + ',' + "'" + codigosucursal + "'" + ',' + "'" + boleta + "'" + ',1,' + aplicarcomision + ')';
            con.connection.query(query, function (error, results, fields) {
                let aplicarpago = 'https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia=' + reference + '&CodigoOperacion=1';
                request.post(aplicarpago, function (error, response, body) { 
                    console.log(body) 
                    let respuesta = {
                        respuesta: true
                    }
                    resolve(respuesta);
                });
             });
        });
    });
}

let grabardatosempeno = async function datos(reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, correoelectronico, monto, codigosucursal, boleta, fechaConsulta, codigotipopago, dias) {
    var conn = new sql.ConnectionPool(conexion);
    tarjeta = tarjeta.substr(-4);
    return new Promise(function (resolve, reject) {
        var url = "api/grabarpagoboleta/reference/" + reference + "/control_number/" + control_number + "/cust_req_date/" + cust_req_date + "/auth_req_date/" + auth_req_date + "/auth_rsp_date/" + auth_rsp_date + "/cust_rsp_date/" + cust_rsp_date + "/payw_result/" + payw_result + "/auth_result/" + auth_result + "/payw_code/" + payw_code + "/auth_code/" + auth_code + "/text/" + text + "/card_holder/" + card_holder + "/ussuing_bank/" + ussuing_bank + "/card_brand/" + card_brand + "/card_type/" + card_type + "/tarjeta/" + tarjeta + "/correoelectronico/" + correoelectronico + "/monto/" + monto + "/codigosucursal/" + codigosucursal + "/boleta/" + boleta + "/correoenviado/0/fechaConsulta/" + fechaConsulta + "/ctpago/" + codigotipopago + "/dias/" + dias + "/esapp/1";
        console.log(url);
        request('http://grupoalvarez.com.mx:8089/maxilanaApp/' + url, function (error, response, body) {
            var response = JSON.parse(body);
            var data = response.data;
            reference = reference ? reference : null;
            control_number = control_number ? control_number : null;
            cust_req_date = cust_req_date ? cust_req_date : null;
            auth_req_date = auth_req_date ? auth_req_date : null;
            auth_rsp_date = auth_rsp_date ? auth_rsp_date : null;
            cust_rsp_date = cust_rsp_date ? cust_rsp_date : null;
            payw_result = payw_result ? payw_result : null;
            auth_result = auth_result ? auth_result : null;
            payw_code = payw_code ? payw_code : null;
            auth_code = auth_code ? auth_code : null;
            text = text ? text : null;
            card_holder = card_holder ? card_holder : null;
            ussuing_bank = ussuing_bank ? ussuing_bank : null;
            card_brand = card_brand ? card_brand : null;
            card_type = card_type ? card_type : null;
            tarjeta = tarjeta ? tarjeta : null;
            correoelectronico = correoelectronico ? correoelectronico : null;
            monto = monto ? monto : null;
            codigosucursal = codigosucursal ? codigosucursal : null;
            boleta = boleta ? boleta : null;
            let query = 'insert into respuestaspw2(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,boleta,enviado) values ' +
                '(' + "'" + reference + "'" + ', ' + "'" + control_number + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + correoelectronico + "'" + ', ' + "'" + monto + "'" + ',' + "'" + codigosucursal + "'" + ',' + "'" + boleta + "'" + ',0)';
            con.connection.query(query, function (error, results, fields) { 
                let aplicarpago = 'https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia=' + reference + '&CodigoOperacion=1';
                request.post(aplicarpago, function (error, response, body) { 
                    console.log(body) 
                    let respuesta = {
                        respuesta: true
                    }
                    resolve(respuesta);
                });
            });
        });
    });
}

let grabardatosempenomultiple = async function datos(reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, pagodetail, esapp) {
    var cnt = 0;
    tarjeta = tarjeta.substr(-4);
    let detalle = pagodetail;
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < detalle.length; i++) {
            reference = reference ? reference : null;
            controlnumber = detalle[i].id ? detalle[i].id : null;
            cust_req_date = cust_req_date ? cust_req_date : null;
            auth_req_date = auth_req_date ? auth_req_date : null;
            auth_rsp_date = auth_rsp_date ? auth_rsp_date : null;
            cust_rsp_date = cust_rsp_date ? cust_rsp_date : null;
            payw_result = payw_result ? payw_result : null;
            auth_result = auth_result ? auth_result : null;
            payw_code = payw_code ? payw_code : null;
            auth_code = auth_code ? auth_code : null;
            text = text ? text : null;
            card_holder = card_holder ? card_holder : null;
            ussuing_bank = ussuing_bank ? ussuing_bank : null;
            card_brand = card_brand ? card_brand : null;
            card_type = card_type ? card_type : null;
            var dates = detalle[i].fechaconsulta.slice(0, 10);
            date = new Date(dates).toISOString().slice(0, 10);
            correoelectronico = detalle[i].correoelectronico ? detalle[i].correoelectronico : null;
            monto = detalle[i].monto ? detalle[i].monto : null;
            codsucursal = detalle[i].codigosucursal ? detalle[i].codigosucursal : null;
            boleta = detalle[i].boleta ? detalle[i].boleta : null;
            codtipopago = detalle[i].codigotipopago ? detalle[i].codigotipopago : null;
            diaspagados = detalle[i].diaspagados ? detalle[i].diaspagados : null;

            let query = 'insert into respuestaspw2(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,boleta,enviado) values ' +
                '(' + "'" + reference + "'" + ', ' + "'" + controlnumber + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + correoelectronico + "'" + ', ' + "'" + monto + "'" + ',' + "'" + codsucursal + "'" + ',' + "'" + boleta + "'" + ',0)';
            cnt = cnt + 1;
            con.connection.query(query, function (error, results, fields) { 
                if (detalle.length == cnt) {
                    let aplicarpago ='https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia='+reference+'&CodigoOperacion=1';
                    request.post(aplicarpago,function(error,response,body){
                        console.log(body)
                        let respuesta = {
                            respuesta: true
                        }
                        resolve(respuesta);
                    });
                }
            });
        }
    });
}

let grabardatosempenoprueba = async function datos(reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, pagodetail, esapp, soloinfo = false) {
    tarjeta = tarjeta.substr(-4);
    let detalle = pagodetail;
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < detalle.length; i++) {
            url = "";
            reference = reference ? reference : 'NULL';
            controlnumber = detalle[i].id ? detalle[i].id : 'NULL';
            cust_req_date = cust_req_date ? cust_req_date : 'NULL';
            auth_req_date = auth_req_date ? auth_req_date : 'NULL';
            auth_rsp_date = auth_rsp_date ? auth_rsp_date : 'NULL';
            cust_rsp_date = cust_rsp_date ? cust_rsp_date : 'NULL';
            payw_result = payw_result ? payw_result : 'NULL';
            auth_result = auth_result ? auth_result : 'NULL';
            payw_code = payw_code ? payw_code : 'NULL';
            auth_code = auth_code ? auth_code : 'NULL';
            text = text ? text : 'NULL';
            card_holder = card_holder ? card_holder : 'NULL';
            ussuing_bank = ussuing_bank ? ussuing_bank : 'NULL';
            card_brand = card_brand ? card_brand : 'NULL';
            card_type = card_type ? card_type : 'NULL';
            var dates = detalle[i].fechaconsulta.slice(0, 10);
            date = new Date(dates).toISOString().slice(0, 10);
            correoelectronico = detalle[i].correoelectronico ? detalle[i].correoelectronico : 'NULL';
            monto = detalle[i].monto ? detalle[i].monto : null;
            codsucursal = detalle[i].codigosucursal ? detalle[i].codigosucursal : 'NULL';
            boleta = detalle[i].boleta ? detalle[i].boleta : 'NULL';
            codtipopago = detalle[i].codigotipopago ? detalle[i].codigotipopago : 'NULL';
            diaspagados = detalle[i].diaspagados ? detalle[i].diaspagados : null;

            let query = `insert into respuestaspw2(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,boleta,enviado) values ` +
                '(' + "'" + reference + "'" + ', ' + "'" + controlnumber + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + detalle[i].correoelectronico + "'" + ', ' + "'" + detalle[i].monto + "'" + ',' + "'" + detalle[i].codigosucursal + "'" + ',' + "'" + detalle[i].boleta + "'" + ',0)';
            con.connection.query(query, function (error, results, fields) { 
                if(error) return reject(error);
                
                url = "api/grabarpagoboleta/reference/" + reference + "/control_number/" + controlnumber + "/cust_req_date/" + cust_req_date + "/auth_req_date/" + auth_req_date + "/auth_rsp_date/" + auth_rsp_date + "/cust_rsp_date/" + cust_rsp_date + "/payw_result/" + payw_result + "/auth_result/" + auth_result + "/payw_code/" + payw_code + "/auth_code/" + auth_code + "/text/" + text + "/card_holder/" + card_holder + "/ussuing_bank/" + ussuing_bank + "/card_brand/" + card_brand + "/card_type/" + card_type + "/tarjeta/" + tarjeta + "/correoelectronico/" + correoelectronico + "/monto/" + monto + "/codigosucursal/" + codsucursal + "/boleta/" + boleta + "/correoenviado/0/fechaConsulta/" + date + "/ctpago/" + codtipopago + "/dias/" + diaspagados + "/esapp/0";;
                request('http://grupoalvarez.com.mx:8089/maxilanaApp/' + url, function (error, response, body) {
                    let aplicarpago = 'https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia=' + reference + '&CodigoOperacion=1';
                    request.post(aplicarpago, function (error, response, body) { 
                        console.log(body) 
                        let respuesta = {
                            respuesta: true
                        }
                        resolve(respuesta);
                    });
                });
            });
        }
    });
}

let grabardatosprestamopersonalyvale = async function datos(reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, ussuing_bank, card_brand, card_type, tarjeta, correoelectronico, monto, codigosucursal, codigoprestamo, esvale) {
    tarjeta = tarjeta.substr(-4);
    return new Promise(function (resolve, reject) {
        reference = reference ? reference : 'NULL';
        control_number = control_number ? control_number : 'NULL';
        cust_req_date = cust_req_date ? cust_req_date : 'NULL';
        auth_req_date = auth_req_date ? auth_req_date : 'NULL';
        auth_rsp_date = auth_rsp_date ? auth_rsp_date : 'NULL';
        cust_rsp_date = cust_rsp_date ? cust_rsp_date : 'NULL';
        payw_result = payw_result ? payw_result : 'NULL';
        auth_result = auth_result ? auth_result : 'NULL';
        payw_code = payw_code ? payw_code : 'NULL';
        auth_code = auth_code ? auth_code : 'NULL';
        text = text ? text : 'NULL';
        card_holder = card_holder ? card_holder : 'NULL';
        ussuing_bank = ussuing_bank ? ussuing_bank : 'NULL';
        card_brand = card_brand ? card_brand : 'NULL';
        card_type = card_type ? card_type : 'NULL';
        tarjeta = tarjeta ? tarjeta : 'NULL';
        correoelectronico = correoelectronico ? correoelectronico : 'NULL';
        monto = monto ? monto : 'NULL';
        let query = 'insert into respuestaspp_pw2(reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,tarjeta,correoelectronico,monto,codigosucursal,codigoprestamo,esvale,enviado) values ' +
            '(' + "'" + reference + "'" + ', ' + "'" + control_number + "'" + ', ' + "'" + cust_req_date + "'" + ', ' + "'" + auth_req_date + "'" + ', ' + "'" + auth_rsp_date + "'" + ', ' + "'" + cust_rsp_date + "'" + ', ' + "'" + payw_result + "'" + ', ' + "'" + auth_result + "'" + ', ' + "'" + payw_code + "'" + ', ' + "'" + auth_code + "'" + ', ' + "'" + text + "'" + ', ' + "'" + card_holder + "'" + ', ' + "'" + ussuing_bank + "'" + ', ' + "'" + card_brand + "'" + ', ' + "'" + card_type + "'" + ', ' + "'" + tarjeta + "'" + ', ' + "'" + correoelectronico + "'" + ', ' + "'" + monto + "'" + ',' + codigosucursal + ',' + "'" + codigoprestamo + "'" + ',' + "'" + esvale + "'" + ',0)';
        console.log(query);
        con.connection.query(query, function (error, results, fields) {
            let query2 = 'select id from respuestaspp_pw2 where reference=' + "'" + reference + "'";
            con.connection.query(query2, function (error, results, fields) {
                if (results != undefined) {
                    Resultado = JSON.parse(JSON.stringify(results));
                    obtenernonce(correoelectronico).then(response => {
                        var url = "http://intranet.maxilana.com/wsprestamos/serviciosprestamos.asmx?WSDL"
                        const args = {
                            id: Resultado[0].id,
                            reference: reference,
                            control_number: control_number,
                            cust_req_date: cust_req_date,
                            auth_req_date: auth_req_date,
                            auth_rsp_date: auth_rsp_date,
                            cust_rsp_date: cust_rsp_date,
                            payw_result: payw_result,
                            auth_result: auth_result,
                            payw_code: payw_code,
                            auth_code: auth_code,
                            text: text,
                            card_holder: card_holder,
                            issuing_bank: ussuing_bank,
                            card_brand: card_brand,
                            card_type: card_type,
                            tarjeta: tarjeta,
                            correoelectronicoN: response.nonce,
                            correoelectronico: response.encynpt,
                            monto: monto,
                            codigosucursal: codigosucursal,
                            codigoprestamo: codigoprestamo
                        };
                        soap.createClient(url, function (err, client) {
                            if (err) console.error(err);
                            else {
                                if (esvale == 1) {
                                    let data = {
                                        strCodigoDistribuidor: codigoprestamo,
                                        dblMonto: monto
                                    }
                                    Object.assign(args, data);

                                    console.log(args)
                                    client.PagosEnLineaValesAplicarPago(args, function (err, response) {
                                        if (err) console.error(err);
                                        else {
                                            result = JSON.parse(JSON.stringify(response));
                                            resolve(result);
                                        }
                                    });
                                } else {
                                    let data = {
                                        strCodigoSucursal: codigosucursal,
                                        strCodigoPrestamo: codigoprestamo,
                                        dblMontoPagado: monto
                                    }
                                    Object.assign(args, data);
                                    console.log(args)
                                    client.PagosEnLineaPrestamosPersonalesAplicarPago(args, function (err, response) {
                                        if (err) console.error(err);
                                        else {
                                            result = JSON.parse(JSON.stringify(response));
                                            resolve(result);
                                        }
                                    });
                                }
                            }
                        });
                    });

                } else {
                    resolve("No hay información para mostrar.")
                }

            });
        });
    });
}

let obtenernonce = async function desencriptar(dato) {
    return new Promise(function (resolve, reject) {
        _sodium.ready;
        const sodium = _sodium;
        const base64key = 'AOLrBEaSnOAePt72IdESAqqVBY//4qvTO47tYdeVK/k=';
        const buff = Buffer.from(base64key, 'base64');
        const str = buff.toString('hex');
        let key = sodium.from_hex(str);


        let butt = Buffer.from(dato, 'base64');
        let tjt = butt.toString('hex');

        let tarjeta = sodium.from_hex(tjt);
        let ciphertext = tarjeta;
        const nonce = ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
        const encryptedMessage = ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
        let x = sodium.crypto_secretbox_open_easy(encryptedMessage, nonce, key)
        let Array = {
            nonce: Buffer.from(nonce, 'binary').toString('base64'),
            encynpt: Buffer.from(encryptedMessage, 'binary').toString('base64')
        }
        resolve(Array);
    });

}
module.exports = {
    grabardatos,
    grabardatosempeno,
    grabardatosprestamopersonalyvale,
    grabardatosempenoprueba,
    grabardatosremates,
    grabardatosempenomultiple,
    grabardatosempenov3
}
