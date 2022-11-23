const express = require('express');
const Router = express.Router();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/general');
const libsodium = require('../../webapi/libsodium/libsodium.js');
const secure = require('../../webapi/pagos/3dsecureremates.js');
const secureboleta = require('../../webapi/pagos/3dsecureempeno');
const secureppyvales = require('../../webapi/pagos/3dsecurepagos');
const carrito = require('../../webapi/carrito/consultas');
const checkCard = require('binlookup')();
const conn = require('mysql');
const { configMaxilanaDB } = require('../../db/config');

async function Desencriptar(data, cb) {
    try {
        const dr = await libsodium.desencriptar(data);
        return cb(undefined, dr);
    } catch (error) {
        return cb(error, undefined);
    }
}
async function Encriptar(data, cb) {
    try {
        const dataencripted = await libsodium.encriptar(data);
        return cb(undefined, dataencripted);
    } catch (error) {
        return cb(error, undefined);
    }
}
const guardarErrores3dSecurePPVales = ({
    referencia_id, nombre, correoelectronico, tarjeta,
    monto, codigosucursal, codigoprestamo, esvale, status
}) => {
    return new Promise((resolve, reject) => {
        Encriptar(nombre, (error, nombreEnc)=>{
            if(error) return reject(error);
            Encriptar(correoelectronico, (error, correoEnc)=>{
                if(error) return reject(error)
                const mysConn = conn.createConnection(configMaxilanaDB);
                mysConn.connect((errcon) => {
                    if (errcon) return reject(errcon);
                    const query = `insert into rechazosautenticacionpp_pw2 
                    (referencia_id, nombre, correoelectronico, tarjeta, monto, codigosucursal, codigoprestamo, esvale, status, fecha) values
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, now())`;
                    mysConn.query(query, [referencia_id, nombreEnc, correoEnc, tarjeta, monto, codigosucursal, codigoprestamo, esvale, status], function (errorqry, results, fields) {
                        if (errorqry) return reject(errorqry);
                        mysConn.end((errorend) => {
                            if (errorend) return reject(errorend);
                            resolve({ status: 'Registro guardado con éxito.' });
                        });
                    })
                })
            })
        })
    })
}
const guardarErrores3dSecureBoletas = ({
    referencia_id, nombre, correoelectronico, tarjeta,
    monto, codigosucursal, boleta, status
}) => {
    return new Promise((resolve, reject) => {
        Encriptar(nombre, (error, nombreEnc)=>{
            if(error) return reject(error);
            Encriptar(correoelectronico, (error, correoEnc)=>{
                if(error) return reject(error)
                const mysConn = conn.createConnection(configMaxilanaDB);
                mysConn.connect((errcon) => {
                    if (errcon) return reject(errcon);
                    const query = `insert into rechazosautenticacionpw2 
                    (referencia_id, nombre, correoelectronico, tarjeta, monto, codigosucursal, boleta, status, fecha) values
                    (?, ?, ?, ?, ?, ?, ?, ?, now())`;
                    mysConn.query(query, [referencia_id, nombreEnc, correoEnc, tarjeta, monto, codigosucursal, boleta, status], function (errorqry, results, fields) {
                        if (errorqry) return reject(errorqry);
                        mysConn.end((errorend) => {
                            if (errorend) return reject(errorend);
                            resolve({ status: 'Registro guardado con éxito.' });
                        });
                    })
                })
            })
        })
    })
}
const guardarErrores3dSecureRemates = ({
    referencia_id, nombre, tarjeta,
    monto, codigosucursal, upc, status
}) => {
    return new Promise((resolve, reject) => {
        Encriptar(nombre, (error, nombreEnc)=>{
            if(error) return reject(error)
            const mysConn = conn.createConnection(configMaxilanaDB);
            mysConn.connect((errcon) => {
                if (errcon) return reject(errcon);
                const query = `insert into rechazosTransaccionRemates 
                (referencia_id, nombre, tarjeta, monto, codigosucursal, upc, status, fecha) values
                ( ?, ?, ?, ?, ?, ?, ?, now())`;
                mysConn.query(query, [referencia_id, nombreEnc, tarjeta, monto, codigosucursal, upc, status], function (errorqry, results, fields) {
                    if (errorqry) return reject(errorqry);
                    mysConn.end((errorend) => {
                        if (errorend) return reject(errorend);
                        resolve({ status: 'Registro guardado con éxito.' });
                    });
                })
            })
        })
    })
}

Router.post('/api/card/checkcreditcard', (req, res, next) => {
    const card = req.body.card ? req.body.card : undefined;
    if (card) {
        checkCard(card, (error, data) => {
            if (error) { return res.send(error) }
            const cc = {
                cardtype: data.scheme ? data.scheme.toUpperCase() : '',
                creditType: data.type ? data.type.toUpperCase() : '',
            }
            return res.send(cc);
        })
    }
});
Router.post('/api/pagos/3dsecure/app/producto/v1', (req, res, next) => {
    try {
        const importe = req.body.importe ? req.body.importe : 0;
        const sucursal = req.body.sucursal ? req.body.sucursal : 0;
        const Name = req.body.nombre ? req.body.nombre : undefined;
        const LastName = req.body.apellido ? req.body.apellido : undefined;
        const Card = req.body.tarjeta ? req.body.tarjeta : undefined;
        const Expires = req.body.vencimiento ? req.body.vencimiento : undefined;
        const Code = req.body.ccv ? req.body.ccv : undefined;
        const TypeCard = req.body.tipotarjeta ? req.body.tipotarjeta : undefined;
        const Street = req.body.calle ? req.body.calle : undefined;
        const Country = req.body.pais ? req.body.pais : undefined;
        const State = req.body.estado ? req.body.estado : undefined;
        const City = req.body.ciudad ? req.body.ciudad : undefined;
        const PostalCode = req.body.cp ? req.body.cp : undefined;
        const PhoneNumber = req.body.celular ? req.body.celular : undefined;
        const upc = req.body.upc ? req.body.upc : undefined;

        //DATOS DE ENVIO
        const nombreenvio = req.body.nombreenvio;
        const celular = req.body.celular;
        const correo = req.body.correo;
        const domicilio = req.body.domicilio;
        const codigopostal = req.body.codigopostal;
        const colonia = req.body.colonia;
        const municipio = req.body.municipio;
        const estado = req.body.estadoenvio;
        const instrucciones = req.body.instrucciones;

        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';

        const Titular = `${Name} ${LastName}`;

        //ENCRIPTAR
        libsodium.encriptar(Titular).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(Card).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(Expires).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(Code).then(respuesta => {
                        encrypCcv = respuesta;
                        //END ENCRIPTAR
                        secure.Obteneridv2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, importe, sucursal, upc, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {
                            secure.Datosdeenvio(respuesta, nombreenvio, celular, correo, domicilio, codigopostal, colonia, municipio, estado, instrucciones).then(respuesta => {

                                //let jwtSecretKey = process.env.JWT_SECRET_KEY;
                                let jwtSecretKey = "a2V5c2VjcmV0bWF4aWxhbmE=";
                                let data = {
                                    time: Date()
                                }
                                const token = jwt.sign(data, jwtSecretKey);
                                let jsonRes = {
                                    JsonWebToken: token,
                                    Resultado: respuesta
                                }
                                res.status(200).send(jsonRes);
                            });
                        });
                    });
                });
            });
        }).catch((error) => {
            return res.status(400).send(error);
        });
    } catch {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/3dsecure/app/boleta/v1', (req, res, next) => {
    try {
        const importe = req.body.importe ? req.body.importe : 0;
        const sucursal = req.body.sucursal ? req.body.sucursal : 0;
        const Name = req.body.nombre ? req.body.nombre : undefined;
        const LastName = req.body.apellido ? req.body.apellido : undefined;
        const Card = req.body.tarjeta ? req.body.tarjeta : undefined;
        const Expires = req.body.vencimiento ? req.body.vencimiento : undefined;
        const Code = req.body.ccv ? req.body.ccv : undefined;
        const TypeCard = req.body.tipotarjeta ? req.body.tipotarjeta : undefined;
        const Street = req.body.calle ? req.body.calle : undefined;
        const Country = req.body.pais ? req.body.pais : undefined;
        const State = req.body.estado ? req.body.estado : undefined;
        const City = req.body.ciudad ? req.body.ciudad : undefined;
        const PostalCode = req.body.cp ? req.body.cp : undefined;
        const PhoneNumber = req.body.celular ? req.body.celular : undefined;
        const boleta = req.body.boleta;
        const email = req.body.email;
        const montoboleto = req.body.prestamo;
        const codigotpago = req.body.codigotipopago;
        const fConsulta = req.body.fechaconsulta;
        const diasPagados = req.body.diaspagados;
        const titular = `${Name} ${LastName}`;

        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        //ENCRIPTAR
        libsodium.encriptar(titular).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(Card).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(Expires).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(Code).then(respuesta => {
                        encrypCcv = respuesta;
                        secureboleta.Obteneridboletav3(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, email, importe, sucursal, boleta, montoboleto, codigotpago, fConsulta, diasPagados, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {
                            const token = jwt.sign(jwtConfig.data, jwtConfig.jwtSecretKey);
                            let jsonRes = {
                                JsonWebToken: token,
                                Resultado: respuesta
                            }
                            res.status(200).send(jsonRes);
                        });
                    });
                });
            });
        }).catch(err => { res.status(400).send(err) });
    } catch {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/3dsecure/web/pp/v1', (req, res, next) => {
    try {
        const Name = req.body.nombre ? req.body.nombre : undefined;
        const LastName = req.body.apellido ? req.body.apellido : undefined;
        const Email = req.body.email ? req.body.email : undefined;
        const Card = req.body.tarjeta ? req.body.tarjeta : undefined;
        const Expires = req.body.vencimiento ? req.body.vencimiento : undefined;
        const Code = req.body.ccv ? req.body.ccv : undefined;
        const TypeCard = req.body.tipotarjeta ? req.body.tipotarjeta : undefined;
        const Street = req.body.calle ? req.body.calle : undefined;
        const Country = req.body.pais ? req.body.pais : undefined;
        const State = req.body.estado ? req.body.estado : undefined;
        const City = req.body.ciudad ? req.body.ciudad : undefined;
        const PostalCode = req.body.cp ? req.body.cp : undefined;
        const PhoneNumber = req.body.celular ? req.body.celular : undefined;
        const Titular = `${Name} ${LastName}`;
        const importe = req.body.importe;
        const sucursal = req.body.sucursal;
        const codigoprestamo = req.body.codigoprestamo;

        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        var encrypCorreo = '';
        //ENCRIPTAR
        libsodium.encriptar(Titular).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(Card).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(Expires).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(Code).then(respuesta => {
                        encrypCcv = respuesta;
                        libsodium.encriptar(Email).then(respuesta => {
                            encrypCorreo = respuesta;
                            secureppyvales.Obteneridprestamosv2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular,
                                importe, sucursal, codigoprestamo, encrypCorreo, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {
                                    const token = jwt.sign(jwtConfig.data, jwtConfig.jwtSecretKey);
                                    let jsonRes = {
                                        JsonWebToken: token,
                                        Resultado: respuesta
                                    }
                                    console.log(jsonRes)
                                    res.status(200).send(jsonRes);
                                });
                        });
                    });
                });
            });
        }).catch((error) => {
            console.log(error);
            res.status(400).send(error);
        });
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/3dsecure/web/vales/v1', async (req, res, next) => {
    try {
        const Name = req.body.nombre ? req.body.nombre : undefined;
        const LastName = req.body.apellido ? req.body.apellido : undefined;
        const Email = req.body.email ? req.body.email : undefined;
        const Card = req.body.tarjeta ? req.body.tarjeta : undefined;
        const Expires = req.body.vencimiento ? req.body.vencimiento : undefined;
        const Code = req.body.ccv ? req.body.ccv : undefined;
        const TypeCard = req.body.tipotarjeta ? req.body.tipotarjeta : undefined;
        const Street = req.body.calle ? req.body.calle : undefined;
        const Country = req.body.pais ? req.body.pais : undefined;
        const State = req.body.estado ? req.body.estado : undefined;
        const City = req.body.ciudad ? req.body.ciudad : undefined;
        const PostalCode = req.body.cp ? req.body.cp : undefined;
        const PhoneNumber = req.body.celular ? req.body.celular : undefined;
        const importe = req.body.importe;
        const titular = `${Name} ${LastName}`;
        const cdistribuidora = req.body.cdistribuidora;

        const encrypTitular = await libsodium.encriptar(titular);
        const encrypTarjeta = await libsodium.encriptar(Card);
        const encrypVencimiento = await libsodium.encriptar(Expires);
        const encrypCcv = await libsodium.encriptar(Code);
        const encrypCorreo = await libsodium.encriptar(Email);

        secureppyvales.Obteneridvalesv2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, importe, cdistribuidora, encrypCorreo, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {
            const token = jwt.sign(jwtConfig.data, jwtConfig.jwtSecretKey);
            let jsonRes = {
                JsonWebToken: token,
                Resultado: respuesta
            }
            return res.status(200).send(jsonRes);
        }).catch(error => {
            return res.status(400).send(error);
        });
        // libsodium.encriptar(titular).then(respuesta => {
        //     encrypTitular = respuesta;
        //     libsodium.encriptar(Card).then(respuesta => {
        //         encrypTarjeta = respuesta;
        //         libsodium.encriptar(Expires).then(respuesta => {
        //             encrypVencimiento = respuesta;
        //             libsodium.encriptar(Code).then(respuesta => {
        //                 encrypCcv = respuesta;
        //                 libsodium.encriptar(Email).then(respuesta => {
        //                     encrypCorreo = respuesta;
        //                     secureppyvales.Obteneridvalesv2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular,
        //                         importe, cdistribuidora, encrypCorreo, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {

        //                             let jwtSecretKey = "a2V5c2VjcmV0bWF4aWxhbmE=";
        //                             let data = {
        //                                 time: Date()
        //                             }
        //                             const token = jwt.sign(data, jwtSecretKey);
        //                             let jsonRes = {
        //                                 JsonWebToken: token,
        //                                 Resultado: respuesta
        //                             }
        //                             res.status(200).send(jsonRes);
        //                         });
        //                 });
        //             });
        //         });
        //     });
        // }).catch(error => {
        //     res.status(400).send({ error: error.message });
        // });
    } catch (error) {
        return res.send({
            error: error.message,
            stack: error.stack
        });
    }
});
Router.post('/api/pagos/3dsecure/web/boleta/v1', (req, res, next) => {
    try {
        const Name = req.body.nombre ? req.body.nombre : undefined;
        const LastName = req.body.apellido ? req.body.apellido : undefined;
        const Email = req.body.email ? req.body.email : undefined;
        const Card = req.body.tarjeta ? req.body.tarjeta : undefined;
        const Expires = req.body.vencimiento ? req.body.vencimiento : undefined;
        const Code = req.body.ccv ? req.body.ccv : undefined;
        const TypeCard = req.body.tipotarjeta ? req.body.tipotarjeta : undefined;
        const Street = req.body.calle ? req.body.calle : undefined;
        const Country = req.body.pais ? req.body.pais : undefined;
        const State = req.body.estado ? req.body.estado : undefined;
        const City = req.body.ciudad ? req.body.ciudad : undefined;
        const PostalCode = req.body.cp ? req.body.cp : undefined;
        const PhoneNumber = req.body.celular ? req.body.celular : undefined;
        const detallepago = JSON.parse(req.body.detallepago);

        const FullName = `${Name} ${LastName}`;

        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        libsodium.encriptar(FullName).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(Card).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(Expires).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(Code).then(respuesta => {
                        encrypCcv = respuesta;
                        secureboleta.Obteneridboletamultiplev2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, Email, detallepago, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {
                            //let jwtSecretKey = process.env.JWT_SECRET_KEY;
                            let jwtSecretKey = "a2V5c2VjcmV0bWF4aWxhbmE=";
                            let data = {
                                time: Date()
                            }
                            const token = jwt.sign(data, jwtSecretKey);
                            let jsonRes = {
                                JsonWebToken: token,
                                Resultado: respuesta
                            }
                            res.status(200).send(jsonRes);
                        });
                    });
                });
            });
        });
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/3dsecure/web/productos/v1', (req, res, next) => {
    try {

        const Name = req.body.nombre ? req.body.nombre : undefined;
        const LastName = req.body.apellido ? req.body.apellido : undefined;
        const Email = req.body.email ? req.body.email : undefined;
        const Card = req.body.tarjeta ? req.body.tarjeta : undefined;
        const Expires = req.body.vencimiento ? req.body.vencimiento : undefined;
        const Code = req.body.ccv ? req.body.ccv : undefined;
        const TypeCard = req.body.tipotarjeta ? req.body.tipotarjeta : undefined;
        const Street = req.body.calle ? req.body.calle : undefined;
        const Country = req.body.pais ? req.body.pais : undefined;
        const State = req.body.estado ? req.body.estado : undefined;
        const City = req.body.ciudad ? req.body.ciudad : undefined;
        const PostalCode = req.body.cp ? req.body.cp : undefined;
        const PhoneNumber = req.body.celular ? req.body.celular : undefined;
        const Titular = `${Name} ${LastName}`;

        //DATOS DE ENVIO
        const nombreenvio = req.body.nombreenvio;
        const celularenvio = req.body.celularenvio;
        const domicilio = req.body.domicilioenvio;
        const codigopostal = req.body.codigopostalenvio;
        const colonia = req.body.coloniaenvio;
        const municipio = req.body.municipioenvio;
        const estado = req.body.estadoenvio;
        const instrucciones = req.body.instruccionesenvio;
        //END DATOS DE ENVIO

        //CARRITO
        const orden = req.body.orden;
        //END CARRITO
        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        libsodium.encriptar(Titular).then(respuesta => {
            encrypTitular = respuesta;
            libsodium.encriptar(Card).then(respuesta => {
                encrypTarjeta = respuesta;
                libsodium.encriptar(Expires).then(respuesta => {
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(Code).then(respuesta => {
                        encrypCcv = respuesta;
                        carrito.Obtenercarrito(orden).then(respuesta => {
                            let total = respuesta.pago.total;
                            let numorden = respuesta.orden;
                            secure.Obteneridmultiplev2(encrypTarjeta, encrypVencimiento, encrypCcv, encrypTitular, respuesta, PhoneNumber, TypeCard, Street, Country, State, City, PostalCode).then(respuesta => {
                                secure.Datosdeenvio(respuesta, nombreenvio, celularenvio, Email, domicilio, codigopostal, colonia, municipio, estado, instrucciones, total, numorden).then(respuesta => {
                                    let jwtSecretKey = "a2V5c2VjcmV0bWF4aWxhbmE=";
                                    let data = {
                                        time: Date()
                                    }
                                    const token = jwt.sign(data, jwtSecretKey);
                                    let jsonRes = {
                                        JsonWebToken: token,
                                        Resultado: respuesta
                                    }
                                    res.status(200).send(jsonRes);
                                });
                            });
                        })

                    });
                });
            });
        });
    } catch (ex) {
        res.status(400).send(ex);
    }
});
Router.post('/api/pagos/3dsecure/rechazos', async (req, res, next) => {
    try {
        const type = req.body.type ? req.body.type : undefined;
        const data = req.body.data ? JSON.parse(JSON.stringify(req.body.data)) : undefined;
        const response = req.body.response ? JSON.parse(JSON.stringify(req.body.response)) : undefined;
        if (!type || type == '') return res.send({ error: 'No se especificó el parámetro [type].', status: '401' });
        if (!data) return res.send({ error: 'No se especificó el parámetro [data].', status: '401' });

        
        switch (type) {
            case 'loans':
            case 'coupons':
                const { ...d } = data.data.data.payment;
                const params = {
                    referencia_id: response.Reference3D,
                    nombre: d.nombre + ' ' + d.apellido,
                    correoelectronico: d.email,
                    tarjeta: d.tarjeta.substring(d.tarjeta.length-4, d.tarjeta.length),
                    monto: d.importe,
                    codigosucursal: type=='loans'?d.sucursal:'0',
                    codigoprestamo: type=='loans'?d.codigoprestamo:d.cdistribuidora,
                    esvale: type=='coupons'?1:0,
                    status: response.status,
                }
                const respcoupons = await guardarErrores3dSecurePPVales(params);
                break;
            case 'pawns':
                const { ...dp } = data.data.data.payment;
                const paramsp = {
                    referencia_id: response.Reference3D,
                    nombre: dp.nombre + ' ' + dp.apellido,
                    correoelectronico: dp.email,
                    tarjeta: dp.tarjeta.substring(dp.tarjeta.length-4, dp.tarjeta.length),
                    monto: dp.importe,
                    codigosucursal: dp.detallepago[0].sucursal,
                    boleta: dp.detallepago[0].boleta,
                    status: response.status,
                }
                const resppawns = await guardarErrores3dSecureBoletas(paramsp);
                break;
            case 'products':
                const { ...dr } = data.data.data.payment;
                const paramsr = {
                    referencia_id: response.Reference3D,
                    nombre: dr.nombre + ' ' + dr.apellido,
                    tarjeta: dr.tarjeta.substring(dr.tarjeta.length-4, dr.tarjeta.length),
                    monto: dr.importe,
                    codigosucursal: data.data.data.cart.cart[0].products[0].branchId,
                    upc: data.data.data.cart.cart[0].products[0].id,
                    status: response.status,
                }
                const respproducts = await guardarErrores3dSecureRemates(paramsr);
                break;
            default:
                return res.send({ error: 'Tipo de movimiento no válido.', status: '401' });
                break;
        }

        return res.send({
            status: '200',
            message: 'Rechazo 3DSecure guardado con éxito.'
        });
    } catch (error) {
        return  res.send({error: error.message, status: '401'})
    }
})
Router.post('/api/tt', () => {
    return res.send('')
})


// VERSION 1.0 DEL 3DSECURE 

module.exports = Router;