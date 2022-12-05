const express = require('express')
const Router = express.Router()
const libsodium = require('../../webapi/libsodium/libsodium.js');
const pw2remates = require('../../webapi/pagos/pw2remates.js');
const email = require('../../webapi/emails/sendemailremate');
const listEndpoints = require('express-list-endpoints');
var uniqid = require("uuid");
const fs = require('fs');

Router.get('/api/reset', (req, res) => {
    var id = uniqid.v4();
    fs.writeFile('./tmp/restart.txt', id, 'utf-8', function (err, data) {
        if (err) throw err;
        return res.send("LA API SE REINICIÓ CON ÉXITO");
    });
});
/////// PRUEBAS SANTOS ////////////////
Router.post('/api/testguardado', async (req, res, next) => {
    try {
        const data = await pw2remates.Obtenerdatos('333444555666777888', '02', '12341234123412341234123412341', '44321223443435wf1234123412', '200', 'VISA');
        return res.send(data);
    } catch (error) {
        return res.send({error: error.message});
    }
});
///////////////////////////////////////
Router.post('/api/decript', (req, res, next)=>{
    const data = req.body.data;
    libsodium.desencriptar(data).then(resp=>{
        return res.send(resp)
    })
})
Router.post('/api/subastas/encrypt',  (req, res) => {
    
    var tjt = req.body.datacard ? req.body.datacard : undefined;
    
    var part1Tjt = (tjt.substring(0, 8));
    var part2Tjt = (tjt.substring(8, 16));
    
    
    var mes = req.body.mm ? req.body.mm : undefined;
    var anio = req.body.aa ? req.body.aa : undefined
    
    libsodium.encriptar(part1Tjt).then(respuesta => {
        var tarjeta = respuesta;
        libsodium.encriptar(part2Tjt).then(respuesta => {
            var tarjetaPart2 = respuesta;
            libsodium.encriptar(mes).then(respuesta => {
                var expmes = respuesta;
                libsodium.encriptar(anio).then(respuesta => {
                    var expanio = respuesta;
                    let resp = {
                        data_ccnumOne: tarjeta,
                        data_ccnumtwo: tarjetaPart2,
                        data_ccexpmes: expmes,
                        data_ccexpanio: expanio
                    }
                    res.send(resp);

                })
            })
        })
    })
    
    
});
Router.post('/api/subastas/decrypt',  (req, res) => {

    var tjt = req.body.datacardOne ? req.body.datacardOne : undefined;
    var tjt2 = req.body.datacardTwo ? req.body.datacardTwo : undefined;
    var mes = req.body.mm ? req.body.mm : undefined;
    var anio = req.body.aa ? req.body.aa : undefined;
    
    libsodium.desencriptar(tjt).then(respuesta => {
        var part1Tjr = "4556" + respuesta + "0000";
        
        libsodium.desencriptar(tjt2).then(respuesta => {
            var part2Tjr = "4556" + respuesta + "0000";
            libsodium.desencriptar(mes).then(respuesta => {
                var expmes = respuesta;
                libsodium.desencriptar(anio).then(respuesta => {
                    var expanio = respuesta;
                    let resp = {
                        data_ccnumOne: part1Tjr,
                        data_ccnumtwo: part2Tjr,
                        data_ccexpmes: expmes,
                        data_ccexpanio: expanio
                    }
                    res.send(resp);
                })
            })
        })
    })

});
Router.post('/api/email/reenvio', (req, res, next)=>{
})
Router.post('/api/sendmailprueba', (req, res, next) => {
    const nombre = req.body.nombre
    const celular = req.body.celular
    const domicilio = req.body.domicilio
    const colonia = req.body.colonia
    const cp = req.body.cp
    const municipio = req.body.municipio
    const estado = req.body.estado
    const instrucciones = req.body.instrucciones
    const articulo = req.body.articulo
    const upc = req.body.upc
    const monto = req.body.monto
    const envio = req.body.envio
    const total = req.body.total;
    const correopersonal = req.body.correopersonal
    const correoenvio = req.body.correoenvio
    const sucursal = req.body.sucursal
    const entregarsucursal = req.body.entregarsucursal?req.body.entregarsucursal == '1'?true:false:false
    const envsuc = req.body.enviosucursal;
    email.sendemail(nombre, celular, domicilio, colonia, 
        cp, municipio, estado, instrucciones, 
        articulo, upc, monto, envio, total, correopersonal, correoenvio, sucursal, entregarsucursal).then((response) => {

    });
    return res.send({ ok: 'ok' })
});
module.exports = Router;