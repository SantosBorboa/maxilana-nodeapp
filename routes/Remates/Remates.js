const express = require('express');
const Router = express.Router();

const remates = require('../../webapi/remates/consultas.js');

Router.get('/api/productos/app/categorias', async (req, res, next) => {
    const { ...params } = req.query
    try {
        const respCategorias = await remates.Obtenerporcategoriaapp(params);
        return res.send(respCategorias);
    } catch (error) {
        return res.send({ error })
    }
});
Router.get('/api/productos', async (req, res, next) => {
    try {
        const { categoria, q, sucursal, ciudad, _categoria, _q, _sucursal, _ciudad, vtalinea, codigo, orden, min, max, page, limit } = req.query;

        const categoria_or = _categoria
        const query_or = _q
        const sucursal_or = _sucursal
        const ciudades_or = _ciudad

        const pagina = page ? page : 1;
        const limits = limit ? limit : 24;

        const respObtenerTodo = await remates.Obtenertodo(
            categoria,
            q,
            sucursal,
            ciudad,
            categoria_or,
            query_or,
            sucursal_or,
            ciudades_or,
            orden,
            min,
            max,
            vtalinea,
            pagina,
            limits,
            codigo
        );
        return res.send(respObtenerTodo);
    } catch (error) {
        return res.send(error)
    }
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
Router.get('/api/productos/:idproducto', async (req, res, next) => {
    try {
        const { idproducto } = req.params
        const producto = await remates.Obtenerarticulosid(idproducto);
        return res.send(producto)
    } catch (error) {
        return res.send(error)
    }
});
Router.get('/api/productos/:idproducto/precio', async (req, res, next) => {
    try {
        const { idproducto } = req.params;
        const respObtenerProdIdPrecio = await remates.Obtenerarticulosidprecio(idproducto);
        return res.send(respObtenerProdIdPrecio);
    } catch (error) {
        return res.send(error);
    }
});

module.exports = Router;