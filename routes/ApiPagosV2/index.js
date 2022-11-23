const express = require('express')
const Router = express.Router()

Router.post('/api/procesar3dsecure/producto',  (req, res, next) => {
    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv = req.body.ccv;
    var importe = req.body.importe;
    var titular = req.body.titular;
    var sucursal = req.body.sucursal;
    var upc = req.body.upc;
    var cardtype = req.body.cardtype;

    //DATOS DE ENVIO
    var nombreenvio = req.body.nombreenvio;
    var celular = req.body.celular;
    var correo = req.body.correo;
    var domicilio = req.body.domicilio;
    var codigopostal = req.body.codigopostal;
    var colonia = req.body.colonia;
    var municipio = req.body.municipio;
    var estado = req.body.estado;
    var instrucciones = req.body.instrucciones;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';

    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta => {
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta => {
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta => {
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta => {
                    encrypCcv = respuesta;
                    secure.Obtenerid(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, importe, sucursal, upc, cardtype).then(respuesta => {
                        secure.Datosdeenvio(respuesta, nombreenvio, celular, correo, domicilio, codigopostal, colonia, municipio, estado, instrucciones).then(respuesta => {
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    });

    //END ENCRIPTAR
});
Router.post('/api/procesar3dsecure/boletas/v2',  (req, res, next) => {//AQUI

    var DetalleBoleta = req.body.detallepago ? req.body.detallepago : undefined;

    if (DetalleBoleta == undefined) {
        var tarjeta = req.body.tarjeta;
        var vencimiento = req.body.vencimiento;
        var ccv = req.body.ccv;
        var importe = req.body.importe;
        var titular = req.body.titular;
        var sucursal = req.body.sucursal;
        var boleta = req.body.boleta;
        var email = req.body.email;
        var montoboleto = req.body.prestamo;
        var codigotpago = req.body.codigotipopago
        var fConsulta = req.body.fechaconsulta;
        var diasPagados = req.body.diaspagados;
        var celular = req.body.celular;
    } else {
        var tarjeta = req.body.tarjeta;
        var vencimiento = req.body.vencimiento;
        var ccv = req.body.ccv;
        var titular = req.body.titular;
        var email = req.body.email;
        var celular = req.body.celular;
    }
    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //<<<---ENCRIPTAR--->>//
    libsodium.encriptar(titular).then(respuesta => {
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta => {
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta => {
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta => {
                    encrypCcv = respuesta;
                    if (DetalleBoleta == undefined) {
                        secureboleta.Obteneridboletav1(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, email, importe, sucursal, boleta, montoboleto, codigotpago, fConsulta, diasPagados).then(respuesta => {
                            res.send(respuesta);
                        });
                    } else {
                        secureboleta.Obteneridboletav2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, email, DetalleBoleta, celular).then(respuesta => {
                            res.send(respuesta);
                        });
                    }
                });
            });
        });
    });

    //END ENCRIPTAR
});
Router.post('/api/procesar3dsecure/boletas/v1',  (req, res, next) => {

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv = req.body.ccv;
    var importe = req.body.importe;
    var titular = req.body.titular;
    var sucursal = req.body.sucursal;
    var boleta = req.body.boleta;
    var email = req.body.email;
    var montoboleto = req.body.prestamo;
    var codigotpago = req.body.codigotipopago
    var fConsulta = req.body.fechaconsulta;
    var diasPagados = req.body.diaspagados;
    var celular = req.body.celular ? req.body.celular : undefined;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta => {

        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta => {
            console.log(respuesta);
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta => {
                console.log(respuesta);
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta => {
                    console.log(respuesta);
                    encrypCcv = respuesta;
                    secureboleta.Obteneridboletav1(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, email, importe, sucursal, boleta, montoboleto, codigotpago, fConsulta, diasPagados, celular).then(respuesta => {
                        res.send(respuesta);
                    });
                });
            });
        });
    });

    //END ENCRIPTAR
});
Router.post('/api/procesar3dsecure/boletas',  (req, res, next) => {

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv = req.body.ccv;
    var importe = req.body.importe;
    var titular = req.body.titular;
    var sucursal = req.body.sucursal;
    var boleta = req.body.boleta;
    var email = req.body.email;
    var montoboleto = req.body.prestamo;
    var codigotpago = req.body.codigotipopago
    var fConsulta = req.body.fechaconsulta;
    var diasPagados = req.body.diaspagados;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta => {

        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta => {
            console.log(respuesta);
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta => {
                console.log(respuesta);
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta => {
                    console.log(respuesta);
                    encrypCcv = respuesta;
                    secureboleta.Obteneridboleta(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, email, importe, sucursal, boleta, montoboleto, codigotpago, fConsulta, diasPagados).then(respuesta => {
                        res.send(respuesta);
                    });
                });
            });
        });
    });

    //END ENCRIPTAR
});
Router.post('/api/procesar3dsecure/vales',  (req, res, next) => {

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv = req.body.ccv;
    var importe = req.body.importe;
    var titular = req.body.titular;
    var cdistribuidora = req.body.cdistribuidora;
    var email = req.body.correoelectronico;
    var celular = req.body.celular ? req.body.celular : undefined;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta => {
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta => {
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta => {
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta => {
                    encrypCcv = respuesta;
                    libsodium.encriptar(email).then(respuesta => {
                        encrypCorreo = respuesta;
                        secureppyvales.Obteneridvales(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, importe, cdistribuidora, encrypCorreo, celular).then(respuesta => {
                            if (celular !== undefined) {
                                sms.send("6671935021", "Entro");
                            }
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    });

    //END ENCRIPTAR
});
Router.post('/api/procesar3dsecure/prestamopersonal',  (req, res, next) => {

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv = req.body.ccv;
    var importe = req.body.importe;
    var titular = req.body.titular;
    var sucursal = req.body.sucursal;
    var codigoprestamo = req.body.codigoprestamo;
    var email = req.body.correoelectronico;
    var celular = req.body.celular ? req.body.celular : undefined;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    var encrypCorreo = '';
    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta => {

        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta => {
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta => {
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta => {
                    encrypCcv = respuesta;
                    libsodium.encriptar(email).then(respuesta => {
                        encrypCorreo = respuesta;
                        secureppyvales.Obteneridprestamos(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, importe, sucursal, codigoprestamo, encrypCorreo, celular).then(respuesta => {
                            if (celular !== undefined) {
                                sms.send("6671935021", "Entro");
                            }
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    });

});
Router.post('/api/procesar2dsecure/producto/v1',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var costoenvio = req.body.envio;
    var Seguro = req.body.seguro;
    var ClickCollect = req.body.recogesucursal == 1 ? true : false;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var precioreal = '';
    var pedido = '';

    pw2remates.Obtenerdatos(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        var datainfo = respuesta[0];
        var CorreoPersonal = datainfo.correoparaconfirmaciondecompra + "," + datainfo.correosucursal;
        CorreoPersonal = CorreoPersonal.split(",");
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo.ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2remates.ejecutarventav1(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.upc, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, Reference3D).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var data = respuesta;
                            sendinfo.grabardatos(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.upc, costoenvio, datainfo.precioneto, Seguro, ClickCollect).then(respuesta => {
                                precioreal = (parseFloat(datainfo.monto) - parseFloat(costoenvio));
                                precioreal = (parseFloat(precioreal) - parseFloat(Seguro));
                                costoenvio = (parseFloat(costoenvio) + parseFloat(Seguro));
                                pedido = respuesta.pedido;
                                email.sendemail(datainfo.nombre, datainfo.celular, datainfo.direccion, datainfo.colonia, datainfo.codigopostal, datainfo.municipio, datainfo.estado, datainfo.instrucciones, datainfo.articulo, datainfo.upc, precioreal, costoenvio, datainfo.monto, CorreoPersonal, datainfo.correoelectronico, datainfo.nombresucursal, ClickCollect);
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
                                res.send(JSON.stringify(response));
                            });
                        } else {
                            res.send("D");
                        }
                    });
                });
            });
        });
    });
});

Router.post('/api/procesar2dsecure/producto',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var costoenvio = req.body.envio;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var precioreal = '';
    var pedido = '';

    pw2remates.Obtenerdatos(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        var datainfo = respuesta[0];
        var CorreoPersonal = datainfo.correoparaconfirmaciondecompra + "," + datainfo.correosucursal;
        //var CorreoPersonal = "erickogarcia12@gmail.com"
        CorreoPersonal = CorreoPersonal.split(",");
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo.ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2remates.ejecutarventa(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.upc, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, Reference3D).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var data = respuesta;
                            sendinfo.grabardatos(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.upc, costoenvio).then(respuesta => {
                                precioreal = (parseFloat(datainfo.monto) - parseFloat(costoenvio));
                                pedido = respuesta.pedido;
                                email.sendemail(respuesta.Pedido, datainfo.nombre, datainfo.celular, datainfo.direccion, datainfo.colonia, datainfo.codigopostal, datainfo.municipio, datainfo.estado, datainfo.instrucciones, datainfo.articulo, datainfo.upc, precioreal, costoenvio, datainfo.monto, CorreoPersonal, datainfo.correoelectronico, datainfo.nombresucursal);
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
                                res.send(JSON.stringify(response));
                            });
                        } else {
                            res.send("D");
                        }
                    });
                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/producto/prueba',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var costoenvio = req.body.envio;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var precioreal = '';
    var pedido = '';

    pw2remates.Obtenerdatos(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        var datainfo = respuesta[0];
        console.log(datainfo)
        var CorreoPersonal = datainfo.correoparaconfirmaciondecompra + "," + datainfo.correosucursal;
        //     var CorreoPersonal = "erickogarcia12@gmail.com"
        CorreoPersonal = CorreoPersonal.split(",");
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo.ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2remates.ejecutarventaprueba(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.upc, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, Reference3D).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var data = respuesta;
                            sendinfo.grabardatos(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.upc, costoenvio).then(respuesta => {
                                precioreal = (parseFloat(datainfo.monto) - parseFloat(costoenvio));
                                pedido = respuesta.pedido;
                                email.sendemail(respuesta.Pedido, datainfo.nombre, datainfo.celular, datainfo.direccion, datainfo.colonia, datainfo.codigopostal, datainfo.municipio, datainfo.estado, datainfo.instrucciones, datainfo.articulo, datainfo.upc, precioreal, costoenvio, datainfo.monto, CorreoPersonal, datainfo.correoelectronico, datainfo.nombresucursal);
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
                                res.send(JSON.stringify(response));
                            });
                        } else {
                            let error = {
                                resultado: "Tarjeta declinada"
                            }
                            res.send(error);
                        }
                    });
                });
            });
        });
    });
});

Router.post('/api/procesar2dsecure/prestamopersonal',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
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

                    pw2valesyprestamos.ejecutarventa(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, 1).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var i = respuesta;
                            sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 0).then(response => {
                                res.send("A")
                            })
                        } else {
                            var i = respuesta;
                            sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 0).then(response => {
                                let error = {
                                    resultado: "Tarjeta declinada"
                                }
                                res.send(error);
                            });
                        }
                    });
                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/boletas/v2',  (req, res, next) => {

    var total = req.body.total ? req.body.total : 0;

    var Reference3D = req.body.Reference3D;
    var Cliente = req.body.Cliente;
    var fechaConsulta = req.body.fechaConsulta;
    var idCliente = req.body.numerocliente;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.Obtenerdatosboletasv2(Reference3D).then(respuesta => {
        var datainfo = respuesta;
        boletareference = Math.floor(datainfo[0].boleta);
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo[0].ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    if (total == 0) {

                    } else {
                        pw2empeno.ejecutarcobrov2(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, boletareference, datainfo[0].status, datainfo[0].eci, datainfo[0].xid, datainfo[0].cavv).then(respuesta => {
                            if (respuesta.resultado_payw == "A") {
                                for (var i = 0; i < datainfo.length; i++) {
                                    //  sms.send("6671935021","Se aplicó un pago a la boleta: " + datainfo[i].boleta + " por un monto de : $" +datainfo[i].monto);
                                }
                                var data = respuesta;
                                sendinfo.grabardatosempenomultiple(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1).then(respuesta => {
                                    procesos.ejecutarpagomultipleapp(data.referencia);
                                    let error = {
                                        resultado: true,
                                        text: respuesta.texto
                                    }
                                    emailempeno.sendemailmultiple(Cliente, total, data.codigo_aut, data.referencia, datainfo[0].fecha, datainfo[0].correoelectronico, datainfo);

                                    res.send(JSON.stringify(error));
                                });
                            } else {
                                let error = {
                                    resultado: false,
                                    text: respuesta.texto
                                }
                                res.send(error);
                            }
                        });
                    }

                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/boletas',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var Cliente = req.body.Cliente;
    var fechaConsulta = req.body.fechaConsulta;


    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.Obtenerdatosboletas(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
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
                        pw2empeno.ejecutarcobro(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, boletareference, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv).then(respuesta => {
                            if (respuesta.resultado_payw == "A") {
                                var data = respuesta;
                                sendinfo.grabardatosempeno(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.boleta, fechaConsulta, datainfo.codigotipopago, datainfo.diaspagados).then(respuesta => {
                                    emailempeno.sendemail(Cliente, datainfo.codigosucursal, datainfo.sucnom, datainfo.boleta, datainfo.monto, data.codigo_aut, data.referencia, datainfo.fecha, CorreoPersonal, datainfo.correoelectronico);
                                    var response = {
                                        cliente: Reference3D,
                                        sucod: datainfo.codigosucursal,
                                        sucnom: datainfo.sucnom,
                                        boleta: datainfo.boleta,
                                        monto: datainfo.monto,
                                        codaut: data.codigo_aut,
                                        referencia: data.referencia
                                    }
                                    res.status(200).send(JSON.stringify(response));
                                });
                            } else {
                                res.send("D");
                            }
                        });
                    });
                });
            });
        } else {
            res.send("D");
        }

    });
});
Router.post('/api/procesar2dsecure/boletas/v3',  (req, res, next) => {//AQUI

    var Reference3D = req.body.Reference3D;
    var Cliente = req.body.Cliente;
    var fechaConsulta = req.body.fechaConsulta;
    var idCliente = req.body.numerocliente ? req.body.numerocliente : undefined;
    var aplicacomision = req.body.aplicacomision ? req.body.aplicacomision : 1;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.Obtenerdatosboletas(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
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
                        pw2empeno.ejecutarcobrov3(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, boletareference, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv).then(respuesta => {
                            if (respuesta.resultado_payw == "A") {
                                var data = respuesta;
                                sms.send(datainfo.celular, "Se aplicó un pago a la boleta: " + datainfo.boleta + " por un monto de : $" + datainfo.monto);
                                sms.sendInfoCentral(datainfo.celular, "Se aplicó un pago a la boleta: " + datainfo.boleta + " por un monto de : $" + datainfo.monto);
                                sendinfo.grabardatosempenov3(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.boleta, fechaConsulta, datainfo.codigotipopago, datainfo.diaspagados, aplicacomision).then(respuesta => {
                                    emailempeno.sendemail(Cliente, datainfo.codigosucursal, datainfo.sucnom, datainfo.boleta, datainfo.monto, data.codigo_aut, data.referencia, datainfo.fecha, CorreoPersonal, datainfo.correoelectronico);
                                    var response = {
                                        cliente: Reference3D,
                                        sucod: datainfo.codigosucursal,
                                        sucnom: datainfo.sucnom,
                                        boleta: datainfo.boleta,
                                        monto: datainfo.monto,
                                        codaut: data.codigo_aut,
                                        referencia: data.referencia
                                    }
                                    res.status(200).send(JSON.stringify(response));
                                });
                            } else {
                                res.send("D");
                            }
                        });
                    });
                });
            });
        } else {
            res.send("D");
        }

    });
});

Router.post('/api/procesar2dsecure/boletas/v1',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var Cliente = req.body.Cliente;
    var fechaConsulta = req.body.fechaConsulta;
    var idCliente = req.body.numerocliente ? req.body.numerocliente : undefined;


    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.Obtenerdatosboletas(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
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
                        pw2empeno.ejecutarcobrov1(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, boletareference, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv).then(respuesta => {
                            if (respuesta.resultado_payw == "A") {
                                var data = respuesta;
                                sms.send(datainfo.celular, "PAGO APLICADO A LA BOLETA " + datainfo.boleta + " DE SUCURSAL " + datainfo.sucnom.toUpperCase() + " POR UN MONTO DE $" + datainfo.monto);
                                sms.sendInfoCentral(datainfo.celular, "PAGO APLICADO A LA BOLETA " + datainfo.boleta + " DE SUCURSAL " + datainfo.sucnom.toUpperCase() + " POR UN MONTO DE $" + datainfo.monto);
                                sendinfo.grabardatosempeno(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.boleta, fechaConsulta, datainfo.codigotipopago, datainfo.diaspagados).then(respuesta => {
                                    emailempeno.sendemail(Cliente, datainfo.codigosucursal, datainfo.sucnom, datainfo.boleta, datainfo.monto, data.codigo_aut, data.referencia, datainfo.fecha, CorreoPersonal, datainfo.correoelectronico);
                                    var response = {
                                        cliente: Reference3D,
                                        sucod: datainfo.codigosucursal,
                                        sucnom: datainfo.sucnom,
                                        boleta: datainfo.boleta,
                                        monto: datainfo.monto,
                                        codaut: data.codigo_aut,
                                        referencia: data.referencia
                                    }
                                    res.status(200).send(JSON.stringify(response));
                                });
                            } else {
                                res.send("D");
                            }
                        });
                    });
                });
            });
        } else {
            res.send("D");
        }

    });
});
Router.post('/api/procesar3dsecure/web/productos',  (req, res, next) => {
    try {
        var tarjeta = req.body.tarjeta;
        var vencimiento = req.body.vencimiento;
        var ccv = req.body.ccv;
        var titular = req.body.titular;

        //DATOS DE ENVIO
        var nombreenvio = req.body.nombreenvio;
        var celular = req.body.celular;
        var correo = req.body.correo;
        var domicilio = req.body.domicilio;
        var codigopostal = req.body.codigopostal;
        var colonia = req.body.colonia;
        var municipio = req.body.municipio;
        var estado = req.body.estado;
        var instrucciones = req.body.instrucciones;

        var orden = req.body.orden;
        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        libsodium.encriptar(titular).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(tarjeta).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(vencimiento).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(ccv).then(respuesta => {
                        encrypCcv = respuesta;
                        carrito.Obtenercarrito(orden).then(respuesta => {
                            let total = respuesta.pago.total;
                            let numorden = respuesta.orden;
                            secure.Obteneridmultiple(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, respuesta).then(respuesta => {
                                secure.Datosdeenvio(respuesta, nombreenvio, celular, correo, domicilio, codigopostal, colonia, municipio, estado, instrucciones, total, numorden).then(respuesta => {
                                    res.send(respuesta);
                                });
                            });
                        })

                    });
                });
            });
        });
    } catch (ex) {
        res.send(ex);
    }
})
Router.post('/api/procesar3dsecure/web/boletas',  (req, res, next) => {
    try {
        var tarjeta = req.body.tarjeta;
        var vencimiento = req.body.vencimiento;
        var ccv = req.body.ccv;
        var titular = req.body.titular;
        var email = req.body.email;
        var celular = req.body.celular ? req.body.celular : undefined;

        var detallepago = req.body.detallepago;
        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        libsodium.encriptar(titular).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(tarjeta).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(vencimiento).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(ccv).then(respuesta => {
                        encrypCcv = respuesta;
                        secureboleta.Obteneridboletamultiple(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, email, detallepago).then(respuesta => {
                            if (celular !== undefined) {
                                sms.send(celular, "Entro");
                            }
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    } catch (ex) {
        res.send(ex);
    }
    //END ENCRIPTAR
})
Router.post('/api/procesar2dsecure/web/productos',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var total = req.body.total;
    var orden = req.body.orden;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : '';
    var cavv = req.body.cavv ? req.body.cavv : '';
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    pw2remates.Obtenerdatosmultiple(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        var datainfo = respuesta;
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo[0].ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2remates.ejecutarcobromultiple(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, datainfo[0].upc, status, eci, xid, cavv).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var data = respuesta;
                            carrito.Obtenercarritoventas(orden).then(respuesta => {
                                var ResOrden = respuesta;
                                console.log(ResOrden);
                                sendinfo.grabardatosremates(data.referencia, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1, ResOrden).then(respuesta => {
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
                                    //var CorreoPersonal = 'egarcia@maxilana.com'
                                    let instrucciones = datainfo[0].instrucciones;
                                    let celular = datainfo[0].celular;

                                    email.sendemailprueba(ResOrden, cliente, celular, domicilio, colonia, cp, municipio, estado, instrucciones, CorreoPersonal, correoelectronico, orden)

                                    let resp = {
                                        resultado: true,
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
                                        text: respuesta.texto
                                    }
                                    res.send(JSON.stringify(resp));

                                });
                            });
                        } else {
                            let error = {
                                resultado: false,
                                text: respuesta.texto
                            }
                            res.send(error);
                        }
                    });

                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/web/boletas',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var Cliente = req.body.Cliente;
    var total = req.body.total;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : '';
    var cavv = req.body.cavv ? req.body.cavv : '';
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.ObtenerdatosboletasPrueba(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        var datainfo = respuesta;
        boletareference = Math.floor(datainfo[0].boleta);
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo[0].ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2empeno.ejecutarcobroprueba(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, boletareference, datainfo[0].status, datainfo[0].eci, datainfo[0].xid, datainfo[0].cavv).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var data = respuesta;
                            sendinfo.grabardatosempenoprueba(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1).then(respuesta => {
                                let error = {
                                    resultado: true,
                                    text: respuesta.texto
                                }
                                emailempeno.sendemailprueba(Cliente, total, data.codigo_aut, data.referencia, datainfo[0].fecha, datainfo[0].correoelectronico, datainfo[0]);

                                res.send(JSON.stringify(error));
                            });
                        } else {
                            let error = {
                                resultado: false,
                                text: respuesta.texto
                            }
                            res.send(error);
                        }
                    });

                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/web/boletas/v1',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var Cliente = req.body.Cliente;
    var total = req.body.total;
    var idCliente = req.body.numerocliente ? req.body.idcliente : undefined;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : '';
    var cavv = req.body.cavv ? req.body.cavv : '';
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt = '';
    var vencimientodecrypt = '';
    var boletareference = '';
    pw2empeno.ObtenerdatosboletasPrueba(Reference3D, eci, xid, cavv, status, cardtype).then(respuesta => {
        var datainfo = respuesta;
        boletareference = Math.floor(datainfo[0].boleta);
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta => {
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta => {
                vencimientodecrypt = respuesta;
                libsodium.desencriptar(datainfo[0].ccv2).then(respuesta => {
                    ccvdecrypt = respuesta;
                    pw2empeno.ejecutarcobropruebav1(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, total, boletareference, datainfo[0].status, datainfo[0].eci, datainfo[0].xid, datainfo[0].cavv).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var data = respuesta;
                            sendinfo.grabardatosempenoprueba(data.referencia, Reference3D, data.fecha_req_cte, data.auth_req_date, data.auth_rsp_date, data.fecha_rsp_cte, data.resultado_payw, data.auth_result, data.payw_code, data.codigo_aut, data.texto, data.card_holder, data.issuing_bank, data.card_brand, data.card_type, tarjetadecrypt, datainfo, 1).then(respuesta => {
                                let error = {
                                    resultado: true,
                                    text: respuesta.texto
                                }
                                emailempeno.sendemailmultiple(Cliente, total, data.codigo_aut, data.referencia, datainfo[0].fecha, datainfo[0].correoelectronico, datainfo);

                                res.send(JSON.stringify(error));
                            });
                        } else {
                            let error = {
                                resultado: false,
                                text: respuesta.texto
                            }
                            res.send(error);
                        }
                    });

                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/vales',  (req, res, next) => {

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

                    pw2valesyprestamos.ejecutarventa(vencimientodecrypt, ccvdecrypt, tarjetadecrypt, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, 1).then(respuesta => {
                        if (respuesta.resultado_payw == "A") {
                            var i = respuesta;
                            sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 1).then(response => {
                                res.send("A")
                            })
                        } else {
                            var i = respuesta;
                            sendinfo.grabardatosprestamopersonalyvale(i.referencia, Reference3D, i.fecha_req_cte, i.auth_req_date, i.auth_rsp_date, i.fecha_rsp_cte, i.resultado_payw, i.auth_result, i.payw_code, i.codigo_aut, i.texto, i.card_holder, i.issuing_bank, i.card_brand, i.card_type, tarjetadecrypt, datainfo.correoelectronico, datainfo.monto, datainfo.codigosucursal, datainfo.codigoprestamo, 1).then(response => {
                                res.send("D");
                            })

                        }
                    });
                });
            });
        });
    });
});
Router.post('/api/procesar2dsecure/subastas',  (req, res, next) => {

    var Reference3D = req.body.Reference3D;
    var lotID = req.body.lotID;

    pw2subastas.Obtenerdatos(Reference3D).then(respuesta => {
        var datainfo = respuesta[0];
        pw2subastas.ejecutarPago(datainfo.Monto, datainfo.referencia, datainfo.tarjeta, datainfo.vencimiento, datainfo.ccv, datainfo.status, datainfo.eci, datainfo.xid, datainfo.cavv, datainfo.control_number, lotID).then(respuesta => {
            if (respuesta.resultado_payw == "A") {
                res.send("A");
            } else {
                res.send("D");
            }

        });
    });
});

module.exports = Router