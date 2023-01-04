const express = require('express')
const Router = express.Router()
const libsodium = require('../../webapi/libsodium/libsodium.js');
const pw2remates = require('../../webapi/pagos/pw2remates.js');
const email = require('../../webapi/emails/sendemailremate');
const listEndpoints = require('express-list-endpoints');
var uniqid = require("uuid");
const fs = require('fs');
const xml2JS = require('xml2js');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path');
const { artifactregistry_v1beta1 } = require('googleapis');
const e = require('express');

const {VerifySQLdata} = require('../../controllers/tools.js');

Router.post('/api/utils/xmlconverter', upload.single('archivoxml'), (req, res, next)=>{
    try {
        const { file } = req;
        if(!file) return res.send({error:'no se ha especificado el archivo xml correctamente.'});
        const pathtoFile = path.join(__dirname, `../../uploads/${file.filename}`)
        const xmlreaded = fs.readFileSync(pathtoFile,{encoding:'utf8', flag:'r'});
        xml2JS.parseString(xmlreaded,{mergeAttrs:true}, async(err, result)=>{
            if(err) return res.send(err);
            fs.rmSync(pathtoFile);
            const {Transaccion} = result.transacciones;
            const arrTransacciones = Transaccion.map((el)=>{
                const o = {
                    afiliacion:el.afiliacion[0].numero[0],
                    referencia:el.referencia[0],
                    numeroControl:el.numeroControl[0],
                    codigoAutorizacion:el.codigoAutorizacion[0],
                    infoTarjeta:el.infoTarjeta[0].numeroTarjetaOfuscado[0],
                    tipo:el.tipo[0],
                    modo:el.modo[0],
                    monto:Intl.NumberFormat('es-MX', { minimumFractionDigits: 2}).format(parseFloat(el.monto[0])),
                    refCliente1:el.refCliente1[0],
                    refCliente2:el.refCliente2[0],
                    refCliente3:el.refCliente3[0],
                    estado:el.estado[0],
                    resultadoPayworks: el.resultadoPayworks[0],
                    textoAdicional:el.textoAdicional[0],
                    fecha:el.fechaRecepCteFECHA[0],
                    hora:el.fechaRecepCteHORA[0],
                }
                return o;
            })
                       
            const arrref = arrTransacciones.filter((el)=>{return el.refCliente2.includes('R-') && el.resultadoPayworks == 'APROBADA'});
            const arrpp = arrTransacciones.filter((el)=>{return el.refCliente2.includes('P-') && el.resultadoPayworks == 'APROBADA'});
            const arrvta = arrTransacciones.filter((el)=>{return el.refCliente2.includes('V') && el.resultadoPayworks == 'APROBADA'});
            
            const listaRef = arrref.reduce((acc, el) => { return acc += `${acc==''?el.referencia:','+el.referencia}` }, '');
            const listaPP = arrpp.reduce((acc, el) => { return acc += `${acc==''?el.referencia:','+el.referencia}` }, '');
            const listaVtas = arrvta.reduce((acc, el) => { return acc += `${acc==''?el.referencia:','+el.referencia}` }, '');
            
            const oReturn = {
                listaRef,
                listaPP,
                listaVtas,
                totalBoletas:arrref.length,
                totalPP:arrpp.length,
                totalVtas:arrvta.length,
                boletas:arrref,
                pp:arrpp,
                vtas:arrvta,
            }
            const dsql = await VerifySQLdata(oReturn);
            oReturn.dsql = dsql;
            return res.send(oReturn);
        })
    } catch (error) {
        return res.send(error.message)
    }
});
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
Router.post('/api/emailremates', async (req, res, next) => {
    try {
        const {nombre, celular, domicilio, colonia, cp, municipio, estado, instrucciones, articulo, upc, monto, envio, total, correopersonal, correoenvio, sucursal, entregarsucursal} = req.body;
        const respMail = await email.sendemail(nombre, celular, domicilio, colonia, cp, municipio, estado, instrucciones, articulo, upc, monto, envio, total, correopersonal, correoenvio, sucursal, entregarsucursal)
        return res.send(respMail)
    } catch (error) {
        return res.send({error})
    }
});
module.exports = Router;