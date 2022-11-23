const express = require('express');
const Router = express.Router();

const vales = require('../../webapi/vales/consultas');

Router.get('/api/servicios/vales/consultarlineadecredito', (req, res) => {
    const {numdistribuidor, contrasena} = req.query
    // let codigodistribuidor = req.query.numdistribuidor;
    // let contrasena = req.query.contrasena
    vales.consultarlineadecredito(numdistribuidor, contrasena).then(respuesta => {
        res.send(respuesta);
    });
});

module.exports = Router;