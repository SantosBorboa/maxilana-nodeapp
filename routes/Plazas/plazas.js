const express = require('express');
const Router = express.Router();

const envios = require('../../webapi/remates/costoenvio.js');
const plazas = require('../../webapi/plazas/consultas.js');

Router.get('/api/ciudades', async (req, res) => {
    try {
        const plz = await plazas.Consultar()
        return res.send(plz)
    } catch (error) {
        return res.send({error})
    }
});
Router.get('/api/obtenercostoenvio/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const costoEnvio = await envios.Costoenvio(codigo);
        return res.send(costoEnvio);
    } catch (error) {
        return res.send({error});
    }

});
Router.get('/api/obtenercostoenvio/v1/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const costoEnvio = await envios.Costoenviov1(codigo);
        return res.send(costoEnvio)        
    } catch (error) {
        return res.send({error});
    }
});

module.exports = Router;