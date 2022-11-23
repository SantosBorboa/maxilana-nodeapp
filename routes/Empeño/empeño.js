const express = require('express');
const Router = express.Router();

const sendContactocliente = require('../../webapi/emails/sendemailcontactocliente');
const emailavaluo = require('../../webapi/emails/sendemailavaluoautos');
const empeno = require('../../webapi/empeno/consultas');
const contacto = require('../../webapi/serviciosadicionales/contacto');

Router.get('/api/boleta', (req, res) => {
    let Boleta = req.query.boleta;
    let Identificador = req.query.letra;
    let Monto = req.query.monto;
    if (Boleta !== undefined && Identificador !== undefined && Monto !== undefined) {
        empeno.obtenerinfoboleta(Boleta, Identificador, Monto).then(respuesta => {
            res.send(respuesta);
        });
    } else {
        res.send("No hay información para mostrar.");
    }
});
Router.get('/api/boleta/wsp', (req, res) => {
    let Boleta = req.query.boleta;
    let Identificador = req.query.letra;
    let Monto = req.query.monto;
    if (Boleta !== undefined && Identificador !== undefined && Monto !== undefined) {
        empeno.obtenerinfoboletaWSP(Boleta, Identificador, Monto).then(respuesta => {
            res.send(respuesta);
        });
    } else {
        res.send("No hay información para mostrar.");
    }
});
Router.get('/api/calculadoraempeno/calcularprestamo', (req, res) => {
    let plaza = req.query.plaza ? req.query.plaza : undefined;
    let correo = req.query.correo ? req.query.correo : undefined;
    let monto = req.query.monto ? req.query.monto : undefined;
    let codigoarticulo = req.query.codigoarticulo ? req.query.codigoarticulo : undefined;
    let codigokilataje = req.query.codigokilataje ? req.query.codigokilataje : undefined;
    let gramos = req.query.gramos ? req.query.gramos : undefined;

    if (plaza !== undefined & correo !== undefined & codigoarticulo !== undefined) {

        if (codigoarticulo == "1") {

            if (gramos !== undefined & codigokilataje !== undefined) {
                monto = 0;
                empeno.calculadoraempeno(plaza, correo, monto, codigoarticulo, codigokilataje, gramos).then(respuesta => {
                    console.log(respuesta);
                    res.send(respuesta);
                });
            } else {
                let resp = {
                    respuesta: "Es necesario el campo gramos y codigokilataje"
                }
                res.send(resp);
            }

        } else {
            if (monto !== undefined) {
                empeno.calculadoraempeno(plaza, correo, monto, codigoarticulo, codigokilataje, gramos).then(respuesta => {
                    res.send(respuesta);
                });
            } else {
                let resp = {
                    respuesta: "Es necesario el campo monto."
                }
                res.send(resp);
            }
        }

    } else {
        res.send("No hay información para mostrar.");
    }

})
Router.get('/api/calculadoraempeno/plazas', (req, res) => {

    empeno.calculadoraempenoplazas().then(respuesta => {
        res.send(respuesta);
    });
})
Router.get('/api/calculadoraempeno/marcas', (req, res) => {
    empeno.calculadoramarcas().then(respuesta => {
        res.send(respuesta);
    });
})
Router.get('/api/calculadoraempeno/kilatajes', (req, res) => {
    empeno.calculadorakilatajes().then(respuesta => {
        res.send(respuesta);
    });
})
Router.post('/api/contacto', (req, res) => {
    let tema = req.body.tema ? req.body.tema : undefined;
    let nombre = req.body.nombre ? req.body.nombre : undefined;
    let email = req.body.email ? req.body.email : undefined;
    let ciudad = req.body.ciudad ? req.body.ciudad : undefined;
    let asunto = req.body.asunto ? req.body.asunto : undefined;
    let mensaje = req.body.mensaje ? req.body.mensaje : undefined;

    console.log(tema)

    if (tema !== undefined & nombre !== undefined & email !== undefined & ciudad !== undefined & asunto !== undefined & mensaje !== undefined) {
        contacto.guardarcontacto(tema, nombre, email, ciudad, asunto, mensaje).then(respuesta => {
            sendContactocliente.sendemail(tema, nombre, email, ciudad, asunto, mensaje);
            let array = { Respuesta: true }
            res.send(array);
        });
    } else {
        res.send("Favor de validar los datos de entrada");
    }

})
Router.post('/api/avaluodeAuto', (req, res, next) => {
    ciudad = req.body.ciudad;
    marca = req.body.marca;
    modelo = req.body.modelo;
    tipo = req.body.tipo;
    cantidad = req.body.cantidad;
    correo = req.body.correo;
    telefono = req.body.telefono;
    nombre = req.body.nombre;
    primerapellido = req.body.primerapellido;
    segundoapellido = req.body.segundoapellido;
    fechanacimiento = req.body.fecnac;
    if (ciudad !== undefined & marca !== undefined & modelo !== undefined & tipo !== undefined & cantidad !== undefined & correo !== undefined & telefono !== undefined & nombre !== undefined & primerapellido !== undefined & segundoapellido !== undefined & fechanacimiento !== undefined) {
        empeno.avaluodeauto(ciudad, marca, modelo, tipo, cantidad, correo, telefono, nombre, primerapellido, segundoapellido, fechanacimiento).then(respuesta => {
            let data = respuesta;
            emailavaluo.sendemail(ciudad, marca, modelo, tipo, cantidad, correo, telefono, nombre, primerapellido, segundoapellido, fechanacimiento, 'info@maxilana.com');
            emailavaluo.sendemail(ciudad, marca, modelo, tipo, cantidad, 'gmendez@maxilana.com', telefono, nombre, primerapellido, segundoapellido, fechanacimiento, correo);
            res.send(data);
        });
    } else {
        res.send("Favor de validar los datos de entrada");
    }
});

module.exports = Router;