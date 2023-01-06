const request = require('../../node_modules/request');
const querystring = require('../../node_modules/querystring');
const { SaveStorage, DeleteStorage, GetDataStorage } = require('../../datastorage/datastore.js');
const { connection  } = require('../../db/conexion.js')

const GuardaInformacionPw2 = async () => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO informacionpw2subastas 
        (idPrincipal, id, tarjeta, vencimiento, ccv2, nombre, monto, codigosucursal,
        upc, fecha, celular, typecard, street, country, state, city, postalcode) VALUES 
        (?,?,?,?,?,?,?,?,?,NOW(),?,?,?,?,?,?,?)`;
        connection.query(query, [], (err, result) => {

        })
    })
};
const GuardarRechazo3ds = async () => {};
const Guardar3dsecure = async ({Reference3D, eci, xid, cavv, status, cardtype}) => {
    return new Promise((resolve, reject) => {
        const query = `insert into informacion3dsecure 
        (reference, eci, xid, cavv, status, cardtype) values }
        (?,?,?,?,?,?)`;
        connection.query(query, [Reference3D, eci, xid, cavv, status, cardtype], (err, result) => {

        })
    })
};
const EjecutarCobroSubasta = async (args) => {
    const {vencimiento, ccv, tarjeta, Monto, Sucursal, upc, status, eci, xid, cavv} = args;
    const Total = parseFloat(Monto).toFixed(2);
    return new Promise(function (resolve, reject) {

        var referencia = 'S' + Sucursal + '-' + upc;
        var myJSONObject = {
            MERCHANT_ID: env.parsed.merchant_id,
            USER: env.parsed.user,
            PASSWORD: env.parsed.password,
            CMD_TRANS: 'AUTH',
            TERMINAL_ID: env.parsed.terminal_id,
            AMOUNT: total,
            MODE: 'DEC',  //DEC PRD AUT
            CUSTOMER_REF2: referencia, // Esto debe de ser lo que ve el cliente en su estado de cuenta    
            CUSTOMER_REF3: 'PAGO SUBASTAS',
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
            resolve(response.headers);
        });
    });
};
const GuardarRespuestaPw2 = async () => {};

module.exports = {
    GuardaInformacionPw2,
    GuardarRechazo3ds,
    Guardar3dsecure,
    EjecutarCobroSubasta,
    GuardarRespuestaPw2,
}