const express = require('express');
const Router = express.Router();

const libsodium = require('../../webapi/libsodium/libsodium.js');
const pw2remates = require('../../webapi/pagos/pw2remates.js');
const sendinfo = require('../../webapi/pagos/sendinfoacentral');
const email = require('../../webapi/emails/sendemailremate');
const emailempeno = require('../../webapi/emails/sendemailempeno');
const pw2empeno = require('../../webapi/pagos/pw2empeno');
const pw2valesyprestamos = require('../../webapi/pagos/pw2prestamosvales');
const sms = require('../../webapi/sms/sendsms');
const jwt = require('jsonwebtoken');
const jwtConf = require('../../config/general');
const carrito = require('../../webapi/carrito/consultas');

const cmd = require('mysql');
const { configMaxilanaDB } = require('../../db/config');

Router.post('/api/pagos/2dsecure/web/boletas', async (req, res, next) => {
    try {
        // const Hearder = req.headers['authorization'];
        // if (typeof Hearder == 'undefined') {
        //     return res.status(401).send({ Message: 'No existe token de autorización.' });
        // }
        // const verifToken = await jwt.verify(Hearder, 'a2V5c2VjcmV0bWF4aWxhbmE=');
        // if (!verifToken.date && !verifToken.user) {
        //     return res.status(401).send({ Message: 'Token inválido' });
        // }

        const Reference3D = req.body.Reference3D;
        const Cliente = req.body.Cliente;
        const total = req.body.total;

        const eci = req.body.eci ? req.body.eci : undefined;
        const xid = req.body.xid ? req.body.xid : '';
        const cavv = req.body.cavv ? req.body.cavv : '';
        const status = req.body.status ? req.body.status : undefined;
        const cardtype = req.body.cardtype ? req.body.cardtype : undefined;

        let tarjetadecrypt = '';
        let ccvdecrypt = '';
        let vencimientodecrypt = '';
        let boletareference = '';
        pw2empeno.ObtenerdatosboletasPrueba(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
            var datainfo = respuesta;
            boletareference = Math.floor(datainfo[0].boleta);
            libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta => {
                tarjetadecrypt = respuesta;
                libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta => {
                    vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo[0].ccv2).then(respuesta => {
                        ccvdecrypt = respuesta;
                        pw2empeno.ejecutarcobrov5(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, boletareference, datainfo[0].status, datainfo[0].eci, datainfo[0].xid, datainfo[0].cavv).then(respuesta => {
                            const { ...data } = respuesta;
                            sendinfo.grabardatosempenoprueba(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1).then(respuesta => {
                                let error = {
                                    Resultado: false,
                                    Mensaje: data.resultado_payw=='A'?'Aprobado':data.texto,
                                }
                                if(data.resultado_payw == "A"){
                                    error.Resultado = true;
                                    emailempeno.sendemailprueba(Cliente, total, data.codigo_aut, data.referencia, datainfo[0].fecha, datainfo[0].correoelectronico, datainfo[0])
                                    .then(respMail=>{
                                        res.status(200).send(JSON.stringify(error));
                                    })
                                }
                            });

                            // if (respuesta.resultado_payw == "A") {
                            //     var data = respuesta;
                            //     sendinfo.grabardatosempenoprueba(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1).then(respuesta => {
                            //         let error = {
                            //             Resultado: true,
                            //             Mensaje: respuesta.texto
                            //         }
                            //         emailempeno.sendemailprueba(Cliente, total, data.codigo_aut, data.referencia, datainfo[0].fecha, datainfo[0].correoelectronico, datainfo[0]);
                            //         res.status(200).send(JSON.stringify(error));
                            //     });
                            // } else {
                            //     let error = {
                            //         Resultado: false,
                            //         Mensaje: respuesta.texto
                            //     }
                            //     res.status(400).send(error);
                            // }
                        });
                    });
                });
            });
        }).catch(error => {
            return res.status(400).send(error);
        });
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/2dsecure/web/producto', async (req, res, next) => {
    try {
        // const Hearder = req.headers['authorization'];
        // if (typeof Hearder == 'undefined') {
        //     return res.status(401).send({ Message: 'No existe token de autorización.' });
        // }
        // const verifToken = await jwt.verify(Hearder, 'a2V5c2VjcmV0bWF4aWxhbmE=');
        // if (!verifToken.date && !verifToken.user) {
        //     return res.status(401).send({ Message: 'Token inválido' });
        // }

        const Reference3D = req.body.Reference3D;
        const total = req.body.total;
        const orden = req.body.orden;

        const eci = req.body.eci ? req.body.eci : undefined;
        const xid = req.body.xid ? req.body.xid : '';
        const cavv = req.body.cavv ? req.body.cavv : '';
        const status = req.body.status ? req.body.status : undefined;
        const cardtype = req.body.cardtype ? req.body.cardtype : undefined;

        const datainfo = await pw2remates.Obtenerdatosmultiple(Reference3D, eci, xid, cavv, status, cardtype);
        const tarjetadecrypt = await libsodium.desencriptar(datainfo[0].tarjeta)
        const ccvdecrypt = await libsodium.desencriptar(datainfo[0].ccv2);
        const vencimientodecrypt = await libsodium.desencriptar(datainfo[0].vencimiento);

        const respuesta = await pw2remates.ejecutarventav3(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, datainfo[0].codigosucursal, datainfo[0].upc, status, eci, xid, cavv);
        if (respuesta.resultado_payw == 'A') {
            const data = respuesta;
            const ResOrden = await carrito.Obtenercarritoventas(orden);
            const sendInfoResp = await sendinfo.grabardatosremates(data.referencia, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1, ResOrden);
            let cliente = datainfo[0].nombre;
            let domicilio = datainfo[0].direccion;
            let cp = datainfo[0].codigopostal;
            let colonia = datainfo[0].colonia;
            let municipio = datainfo[0].municipio;
            let estado = datainfo[0].estado;
            let correoelectronico = datainfo[0].correoelectronico;
            let correoparaconfirmaciondecompra = datainfo[0].correoparaconfirmaciondecompra;
            let correosucursal = datainfo[0].correosucursal;
            var CorreoPersonal = correoparaconfirmaciondecompra + "," + correosucursal;
            let instrucciones = datainfo[0].instrucciones;
            let celular = datainfo[0].celular;

            const respEmail = await email.sendemailprueba(ResOrden, cliente, celular, domicilio, colonia, cp, municipio, estado, instrucciones, CorreoPersonal, correoelectronico, orden);
            let resp = {
                Resultado: true,
                referencia: data.codigo_aut,
                datosenvio: {
                    nombre: cliente,
                    celular: celular,
                    domicilio: domicilio,
                    colonia: colonia,
                    codigopostal: cp,
                    municipio: municipio,
                    estado: estado,
                    instrucciones: instrucciones
                },
                Mensaje: respuesta.texto
            }
            res.send(JSON.stringify(resp));
        } else {
            let error = {
                Resultado: false,
                Mensaje: respuesta.texto
            }
            res.send(error);
        }
        // const Hearder = req.headers['authorization'];

        // if(true){// (typeof Hearder != 'undefined') {

        //     jwt.verify(Hearder, 'a2V5c2VjcmV0bWF4aWxhbmE=', (err, authData) => {
        //         if (false) {// (err){
        //             res.send(403);
        //         } else {
        //             const Reference3D = req.body.Reference3D;
        //             const total = req.body.total;
        //             const orden = req.body.orden;

        //             const eci = req.body.eci ? req.body.eci : undefined;
        //             const xid = req.body.xid ? req.body.xid : '';
        //             const cavv = req.body.cavv ? req.body.cavv : '';
        //             const status = req.body.status ? req.body.status : undefined;
        //             const cardtype = req.body.cardtype ? req.body.cardtype : undefined;

        //             var tarjetadecrypt = '';
        //             var ccvdecrypt = '';
        //             var vencimientodecrypt = '';

        //             pw2remates.Obtenerdatosmultiple(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        //                 var datainfo = respuesta;
        //                 libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta => {
        //                     tarjetadecrypt = respuesta;
        //                     libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta => {
        //                         vencimientodecrypt = respuesta;
        //                         libsodium.desencriptar(datainfo[0].ccv2).then(respuesta => {
        //                             ccvdecrypt = respuesta;
        //                             pw2remates.ejecutarventav3(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, datainfo[0].codigosucursal, datainfo[0].upc, status, eci, xid, cavv).then(respuesta => {
        //                                 if (respuesta.resultado_payw == "A") {
        //                                     var data = respuesta;
        //                                     carrito.Obtenercarritoventas(orden).then(respuesta => {
        //                                         var ResOrden = respuesta;
        //                                         sendinfo.grabardatosremates(data.referencia, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1, ResOrden).then(respuesta => {
        //                                             let cliente = datainfo[0].nombre;
        //                                             let domicilio = datainfo[0].direccion;
        //                                             let cp = datainfo[0].codigopostal;
        //                                             let colonia = datainfo[0].colonia;
        //                                             let municipio = datainfo[0].municipio;
        //                                             let estado = datainfo[0].estado;
        //                                             let correoelectronico = datainfo[0].correoelectronico;
        //                                             let correoparaconfirmaciondecompra = datainfo[0].correoparaconfirmaciondecompra;
        //                                             let correosucursal = datainfo[0].correosucursal;
        //                                             var CorreoPersonal = correoparaconfirmaciondecompra + "," + correosucursal;
        //                                             let instrucciones = datainfo[0].instrucciones;
        //                                             let celular = datainfo[0].celular;

        //                                             email.sendemailprueba(ResOrden, cliente, celular, domicilio, colonia, cp, municipio, estado, instrucciones, CorreoPersonal, correoelectronico, orden)

        //                                             let resp = {
        //                                                 resultado: true,
        //                                                 referencia: data.codigo_aut,
        //                                                 datosenvio: {
        //                                                     nombre: cliente,
        //                                                     celular: celular,
        //                                                     domicilio: domicilio,
        //                                                     colonia: colonia,
        //                                                     codigopostal: cp,
        //                                                     municipio: municipio,
        //                                                     estado: estado,
        //                                                     instrucciones: instrucciones
        //                                                 },
        //                                                 text: respuesta.texto
        //                                             }
        //                                             res.send(JSON.stringify(resp));

        //                                         });
        //                                     });
        //                                 } else {
        //                                     let error = {
        //                                         resultado: false,
        //                                         text: respuesta.texto
        //                                     }
        //                                     res.send(error);
        //                                 }
        //                             });

        //                         });
        //                     });
        //                 });
        //             });

        //         }
        //     });
        // } else {
        //     let arrayError = {
        //         Message: 'Token inválido'
        //     }
        //     res.status(401).send(arrayError);
        // }
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/2dsecure/vales', async (req, res, next) => {
    try {
        // const Hearder = req.headers['authorization'];
        // if (typeof Hearder == 'undefined') {
        //     return res.status(401).send({ Resultado: false, Mensaje: 'No existe token de autorización.' });
        // }
        // const verifToken = await jwt.verify(Hearder, 'a2V5c2VjcmV0bWF4aWxhbmE=');
        // if (!verifToken.date && !verifToken.user) {
        //     return res.status(401).send({ Resultado: false, Mensaje: 'Token inválido' });
        // }

        var Reference3D = req.body.Reference3D;

        var eci = req.body.eci ? req.body.eci : undefined;
        var xid = req.body.xid ? req.body.xid : '';
        var cavv = req.body.cavv ? req.body.cavv : '';
        var status = req.body.status ? req.body.status : undefined;
        var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

        var tarjetadecrypt = '';
        var ccvdecrypt = '';
        var vencimientodecrypt = '';

        pw2valesyprestamos.Obtenerdatos(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
            var datainfo = respuesta[0];
            libsodium.desencriptar(datainfo.tarjeta).then(respuesta => {
                tarjetadecrypt = respuesta;
                libsodium.desencriptar(datainfo.vencimiento).then(respuesta => {
                    vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.cvv2).then(respuesta => {
                        ccvdecrypt = respuesta;
                        pw2valesyprestamos.ejecutarventav1(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, 1).then(async(respuesta) => {
                            const i = respuesta;
                            if (i.resultado_payw == "A") {
                                sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 1).then(async(response) => {
                                    let Res = {
                                        Resultado: true,
                                        Mensaje: 'Aprobado'
                                    }
                                    await sms.send(datainfo.celular, "Se aplicó un pago al distribuidor: " + datainfo.codigoprestamo + " por un monto de : $" + datainfo.monto);
                                    await sms.sendInfoCentral(datainfo.celular, "Se aplicó un pago a la distribuidora: " + datainfo.codigoprestamo + " por un monto de : $" + datainfo.monto);
                                    res.status(200).send(Res)
                                })
                            } else {
                                sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 1).then(response => {
                                    let Res = {
                                        Resultado: false,
                                        Mensaje: i.texto
                                    }
                                    res.status(200).send(Res)
                                })
                            }
                        });
                    });
                });
            });
        });
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/2dsecure/pp', async (req, res, next) => {
    try {
        // const Hearder = req.headers['authorization'];
        // if (typeof Hearder == 'undefined') {
        //     return res.status(401).send({ Resultado: false, Mensaje: 'No existe token de autorización.' });
        // }
        // const verifToken = await jwt.verify(Hearder, 'a2V5c2VjcmV0bWF4aWxhbmE=');
        // if (!verifToken.date && !verifToken.user) {
        //     return res.status(401).send({ Resultado: false, Mensaje: 'Token inválido' });
        // }

        const Reference3D = req.body.Reference3D;

        const eci = req.body.eci ? req.body.eci : undefined;
        const xid = req.body.xid ? req.body.xid : '';
        const cavv = req.body.cavv ? req.body.cavv : '';
        const status = req.body.status ? req.body.status : undefined;
        const cardtype = req.body.cardtype ? req.body.cardtype : undefined;

        const respDatos = await pw2valesyprestamos.Obtenerdatos(Reference3D, eci, xid, cavv, status, cardtype);
        const datainfo = respDatos[0];

        const tarjetadecrypt = await libsodium.desencriptar(datainfo.tarjeta);
        const ccvdecrypt = await libsodium.desencriptar(datainfo.cvv2);
        const vencimientodecrypt = await libsodium.desencriptar(datainfo.vencimiento);

        const respuestapw2 = await pw2valesyprestamos.ejecutarventav1(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, 1);
        const { ...i } = respuestapw2;
        sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 0).then(async(response) => {
            let Res = {
                Resultado: false,
                Mensaje: i.resultado_payw=='A'?'Aprobado':i.texto,
            }

            if(i.resultado_payw =='A'){
                Res.Resultado = true;
                await sms.send(datainfo.celular, "Se aplicó un pago al prestamo: " + datainfo.codigosucursal + "-" + datainfo.codigoprestamo + " por un monto de : $" + datainfo.monto);
                await sms.sendInfoCentral(datainfo.celular, "Se aplicó un pago al prestamo: " + datainfo.codigoprestamo + " por un monto de : $" + datainfo.monto);    
            }

            return res.status(200).send(Res)
        })
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/2dsecure/producto/v1', (req, res, next) => {
    const Reference3D = req.body.Reference3D;
    var costoenvio = req.body.envio;
    const Seguro = req.body.seguro;
    const ClickCollect = req.body.recogesucursal;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var precioreal = '';
    var pedido = '';

    pw2remates.Obtenerdatosv2(Reference3D).then(respuesta => {
        var datainfo = respuesta[0];
        var CorreoPersonal = datainfo.correoparaconfirmaciondecompra + "," + datainfo.correosucursal;
        CorreoPersonal = CorreoPersonal.split(",");
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo.ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2remates.ejecutarventav2(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.upc, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, Reference3D).then(respuesta => {
                        const {...data} = respuesta;
                        sendinfo.grabardatos(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.upc, costoenvio, datainfo.precioneto, Seguro, ClickCollect).then(async(respuesta) => {
                            if(data.resultado_payw == "A"){
                                precioreal = (parseFloat(datainfo.monto) - parseFloat(costoenvio));
                                precioreal = (parseFloat(precioreal) - parseFloat(Seguro));
                                costoenvio = (parseFloat(costoenvio) + parseFloat(Seguro));
                                await email.sendemail(datainfo.nombre, datainfo.celular, datainfo.direccion, datainfo.colonia, datainfo.codigopostal, datainfo.municipio, datainfo.estado, datainfo.instrucciones, datainfo.articulo, datainfo.upc, precioreal, costoenvio, datainfo.monto, CorreoPersonal, datainfo.correoelectronico, datainfo.nombresucursal);
                                var response = {
                                    referencia: Reference3D,
                                    monto: parseFloat(datainfo.monto),
                                    articulo: datainfo.articulo,
                                    contacto: datainfo.celular,
                                    dom: datainfo.direccion + " " + datainfo.colonia + " " + datainfo.codigopostal,
                                    mun: datainfo.municipio,
                                    ciudad: datainfo.estado,
                                    nombreenvio: datainfo.nombre,
                                    envio: costoenvio
                                }
                                res.status(200).send(JSON.stringify(response));
                            }else{
                                return res.send("D");
                            }
                        }).catch(err => {return res.status(400).send({error: err})})
                        // if (respuesta.resultado_payw == "A") {
                        //     // var data = respuesta;
                        //     sendinfo.grabardatos(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.upc, costoenvio, datainfo.precioneto, Seguro, ClickCollect).then(respuesta => {
                        //         precioreal = (parseFloat(datainfo.monto) - parseFloat(costoenvio));
                        //         precioreal = (parseFloat(precioreal) - parseFloat(Seguro));
                        //         costoenvio = (parseFloat(costoenvio) + parseFloat(Seguro));
                        //         email.sendemail(datainfo.nombre, datainfo.celular, datainfo.direccion, datainfo.colonia, datainfo.codigopostal, datainfo.municipio, datainfo.estado, datainfo.instrucciones, datainfo.articulo, datainfo.upc, precioreal, costoenvio, datainfo.monto, CorreoPersonal, datainfo.correoelectronico, datainfo.nombresucursal);
                        //         var response = {
                        //             referencia: Reference3D,
                        //             monto: parseFloat(datainfo.monto),
                        //             articulo: datainfo.articulo,
                        //             contacto: datainfo.celular,
                        //             dom: datainfo.direccion + " " + datainfo.colonia + " " + datainfo.codigopostal,
                        //             mun: datainfo.municipio,
                        //             ciudad: datainfo.estado,
                        //             nombreenvio: datainfo.nombre,
                        //             envio: costoenvio
                        //         }
                        //         res.status(200).send(JSON.stringify(response));
                        //     });
                        // } else {
                        //     res.send("D");
                        // }
                    });
                });
            });
        });
    }).catch(error=>{return res.status(400).send({error})});
});
Router.post('/api/pagos/2dsecure/boletas/v1', (req, res, next) => {//AQUI

    const Reference3D = req.body.Reference3D;
    const Cliente = req.body.Cliente;
    const fechaConsulta = req.body.fechaConsulta;
    const idCliente = req.body.numerocliente ? req.body.numerocliente : undefined;
    const aplicacomision = req.body.aplicacomision ? req.body.aplicacomision : 1;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.Obtenerdatosboletasv3(Reference3D).then(respuesta => {
        console.log(respuesta)
        if (respuesta !== null) {
            var datainfo = respuesta[0];
            var CorreoPersonal = datainfo.correoelectronicoparanotificacion;
            CorreoPersonal = CorreoPersonal.split(",");
            boletareference = Math.floor(datainfo.boleta);
            libsodium.desencriptar(datainfo.tarjeta).then(respuesta => {
                tarjetadecrypt = respuesta;
                libsodium.desencriptar(datainfo.vencimiento).then(respuesta => {
                    vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.ccv2).then(respuesta => {
                        ccvdecrypt = respuesta;
                        pw2empeno.ejecutarcobrov4(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, boletareference, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv).then(async (respuesta) => {
                            const {...data} = respuesta;
                            sendinfo.grabardatosempenov3(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.boleta, fechaConsulta, datainfo.codigotipopago, datainfo.diaspagados, aplicacomision).then(async(respuesta) => {
                                if (data.resultado_payw == "A") {
                                    await sms.send(datainfo.celular, "Se aplicó un pago a la boleta: " + datainfo.boleta + " por un monto de : $" + datainfo.monto);
                                    await sms.sendInfoCentral(datainfo.celular, "Se aplicó un pago a la boleta: " + datainfo.boleta + " por un monto de : $" + datainfo.monto);        
                                    await emailempeno.sendemail(Cliente, datainfo.codigosucursal, datainfo.sucnom, datainfo.boleta, datainfo.monto, data.codigo_aut, data.referencia, datainfo.fecha, CorreoPersonal, datainfo.correoelectronico);
                                    var response = {
                                        cliente: Reference3D,
                                        sucod: datainfo.codigosucursal,
                                        sucnom: datainfo.sucnom,
                                        boleta: datainfo.boleta,
                                        monto: datainfo.monto,
                                        codaut: data.codigo_aut,
                                        referencia: data.referencia
                                    }
                                    return res.status(200).send(JSON.stringify(response));
                                } else {
                                    return res.send("D");
                                }
                            });
                        });
                    });
                });
            });
        } else {
            res.send("D");
        }

    });
});
// async function guardarRespuestasPP_PW2(reference3d, dataPw2, info, card, esvale) {
//     return new Promise((resolve, reject) => {
//         const { referencia, resultado_payw, id_afiliacion, fecha_req_cte, fecha_rsp_cte, texto } = dataPw2;
//         const query = `insert into respuestaspp_pw2 (reference, control_number, cust_req_date, auth_req_date, auth_rsp_date, 
//         cust_rsp_date, payw_result, auth_result, payw_code, auth_code, text, card_holder, issuing_bank, 
//         card_brand, card_type, tarjeta, correoelectronico, monto, codigosucursal, codigoprestamo, esvale, enviado) values 
//         (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
//         try {
//             const conn = cmd.createConnection(configMaxilanaDB);
//             conn.connect((err) => {
//                 if (err) return reject(err);
//                 conn.beginTransaction((error) => {
//                     if (error) return reject(error);
//                     conn.query(query, 
//                         [referencia, reference3d, fecha_req_cte, '', '',
//                         fecha_rsp_cte, resultado_payw, '', '', id_afiliacion, texto, '', '',
//                         '', '', card.substring(card.length - 4, card.length), info.correoelectronico, info.monto, info.codigosucursal, info.codigoprestamo, esvale, false], (error, results, fields) => {
//                         if (error) return reject(error);
//                         conn.commit((error) => {
//                             if (error) return reject(error);
//                             conn.end((error) => {
//                                 if (error) return reject(error)
//                                 const returnValue = {
//                                     Result: true,
//                                 }
//                                 return resolve(returnValue);
//                             });
//                         })
//                     })
//                 })
//             })
//         } catch (error) {
//             return reject(error);
//         }
//     })
// };
module.exports = Router;