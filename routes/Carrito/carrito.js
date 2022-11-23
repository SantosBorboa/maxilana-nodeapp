const express = require('express');
const Router = express.Router();

const carrito = require('../../webapi/carrito/consultas.js');

Router.post('/api/carrito/nuevo', async(req, res, next) => {
    let codigo = req.body.codigo ? req.body.codigo : undefined;
    console.log(codigo);
    carrito.Altacarrito(codigo).then(respuesta => {
        carrito.Obtenercarrito(respuesta).then(respuesta => {
            res.send(respuesta);
        })
    });
})
Router.post('/api/carrito/agregararticulo', (req, res, next) => {
    let codigo = req.body.codigo ? req.body.codigo : undefined;
    let orden = req.body.orden ? req.body.orden : undefined;
    carrito.Agregarcarrito(orden, codigo).then(respuesta => {
        carrito.Obtenercarrito(respuesta).then(respuesta => {
            res.send(respuesta);
        })
    });
})

Router.post('/api/carrito/eliminararticulo',  (req, res, next) => {
    let codigo = req.body.codigo ? req.body.codigo : undefined;
    let orden = req.body.orden ? req.body.orden : undefined;
    carrito.Borrararticulo(orden, codigo).then(respuesta => {
        carrito.Obtenercarrito(respuesta).then(respuesta => {
            res.send(respuesta);
        })
    });
})

Router.get('/api/carrito', (req, res) => {

    let orden = req.query.orden ? req.query.orden : undefined;

    carrito.Obtenercarritoventas(orden).then(respuesta => {
        res.send(respuesta);
    })

});
module.exports = Router;