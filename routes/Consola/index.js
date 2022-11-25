const express = require('express')
const Router = express.Router()
const vtas = require('../../consola/ventas');
const pagosempeno = require('../../consola/empeno');

Router.get('/api/consola/pagos/ventas', (req, res) => {
    var tipo = req.query.tipo ? req.query.tipo : 1;
    var upc = req.query.upc ? req.query.upc : 0;
    vtas.obtenerventas(tipo, upc).then(respuesta => {
        res.send(respuesta);
    })
});
Router.post('/api/consola/pagos/empeno',  (req, res) => {
    var bol = req.body.Boleta;
    var CodigoAuth = req.body.CodigoAuth;
    var Referencia = req.body.Referencia;
    pagosempeno.Obtenerpagos(bol, CodigoAuth, Referencia)
    .then(response => {
        res.send(response);
    })
    .catch(err => {return res.send(err);});
})
Router.post('/api/consola/pagos/control',  (req, res) => {
    var control_number = req.body.control;
    pagosempeno.obtenerinfo3d(control_number).then(response => {
        res.send(response);
    });
})
Router.post('/api/consola/pagos/ppyvales',  (req, res) => {
    
})

module.exports = Router