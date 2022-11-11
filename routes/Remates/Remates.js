const express = require('express');
const Router = express.Router();

const remates = require('../../webapi/remates/consultas.js');

Router.get('/api/productos/app/categorias', (req, res, next) => {
    remates.Obtenerporcategoriaapp().then(respuesta => {
        return res.send(respuesta);
    }).catch(err => {return res.status(400).send({ error: err });});
});
Router.get('/api/productos', (req, res, next) => {
    let categoria = req.query.categoria ? req.query.categoria : undefined;
    let query = req.query.q ? req.query.q : undefined;
    let sucursal = req.query.sucursal ? req.query.sucursal : undefined;
    let ciudades = req.query.ciudad ? req.query.ciudad : undefined;

    let categoria_or = req.query._categoria ? req.query._categoria : undefined;
    let query_or = req.query._q ? req.query._q : undefined;
    let sucursal_or = req.query._sucursal ? req.query._sucursal : undefined;
    let ciudades_or = req.query._ciudad ? req.query._ciudad : undefined;

    let vtalinea = req.query.vtalinea ? req.query.vtalinea : undefined;

    let codigo = req.query.codigo ? req.query.codigo : undefined;
    let orden = req.query.orden ? req.query.orden : undefined;
    let min = req.query.min ? req.query.min : undefined;
    let max = req.query.max ? req.query.max : undefined;

    let page = req.query.page ? req.query.page : 1;
    let limits = req.query.limit ? req.query.limit : 24;
    remates.Obtenertodo(
        categoria,
        query,
        sucursal,
        ciudades,
        categoria_or,
        query_or,
        sucursal_or,
        ciudades_or,
        orden,
        min,
        max,
        vtalinea,
        page,
        limits,
        codigo
    ).then(respuesta => {
        res.send(respuesta);
    });
});
Router.get('/api/productos/prueba', (req, res, next) => {

    let categoria = req.query.categoria ? req.query.categoria : undefined;
    let query = req.query.q ? req.query.q : undefined;
    let sucursal = req.query.sucursal ? req.query.sucursal : undefined;
    let ciudades = req.query.ciudad ? req.query.ciudad : undefined;

    let categoria_or = req.query._categoria ? req.query._categoria : undefined;
    let query_or = req.query._q ? req.query._q : undefined;
    let sucursal_or = req.query._sucursal ? req.query._sucursal : undefined;
    let ciudades_or = req.query._ciudad ? req.query._ciudad : undefined;

    let vtalinea = req.query.vtalinea ? req.query.vtalinea : undefined;

    let codigo = req.query.codigo ? req.query.codigo : undefined;
    let orden = req.query.orden ? req.query.orden : undefined;
    let min = req.query.min ? req.query.min : undefined;
    let max = req.query.max ? req.query.max : undefined;

    let page = req.query.page ? req.query.page : 1;
    let limits = req.query.limit ? req.query.limit : 10;
    remates.Obtenertodoprueba(
        categoria,
        query,
        sucursal,
        ciudades,
        categoria_or,
        query_or,
        sucursal_or,
        ciudades_or,
        orden,
        min,
        max,
        vtalinea,
        page,
        limits,
        codigo
    ).then(respuesta => {
        res.send(respuesta);
    });


});
Router.get('/api/productos/:idproducto', (req, res, next) => {
    const { idproducto } = req.params
    remates.Obtenerarticulosid(idproducto).then(respuesta => {
        res.send(respuesta);
    })
});
Router.get('/api/productos/:idproducto/precio', (req, res, next) => {
    const { idproducto } = req.params
    remates.Obtenerarticulosidprecio(idproducto).then(respuesta => {
        res.send(respuesta);
    })
});

module.exports = Router;