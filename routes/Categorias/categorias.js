const express = require('express');
const Router = express.Router();
const remates = require('../../webapi/remates/consultas.js');

Router.get('/api/categorias', (req, res) => {
    const { tipo, sucursal } = req.params

    remates.Obtenertipos(tipo, sucursal).then(respuesta => {
        res.send(respuesta);
    })
});

module.exports = Router;