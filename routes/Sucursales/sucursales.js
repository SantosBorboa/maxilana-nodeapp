const express = require('express');
const Router = express.Router();

const sucursales = require('../../webapi/sucursales/consultas.js');

Router.get('/api/sucursales', (req, res) => {
    if (req.query.ciudad == undefined) {
        sucursales.Obtenersucursales().then(respuesta => {
            res.send(respuesta);
        })
    } else {
        sucursales.Obtenersucursalesciudad(req.query.ciudad).then(respuesta => {
            res.send(respuesta);
        })
    }

});
Router.get('/api/sucursal/:id_slug', (req, res) => {
    const { id_slug } = req.params
    sucursales.Obtenersucursalporid(id_slug).then(respuesta => {
        res.send(respuesta);
    })
});

module.exports = Router;