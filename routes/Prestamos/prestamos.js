const express = require('express');
const Router = express.Router();

const prestamos = require('../../webapi/prestamos/consultas.js');

Router.get('/api/servicios/pp/consultarprestamo', async(req, res) => {
    if (req.query.codigoprestamo !== undefined && req.query.prestamo !== undefined) {
        let codigoprestamo = req.query.codigoprestamo;
        let sucursal = codigoprestamo.substr(0, codigoprestamo.indexOf('-'));
        let codigo = codigoprestamo.substr(codigoprestamo.indexOf('-') + 1);
        let prestamo = req.query.prestamo;
        prestamos.consultarprestamo(sucursal, codigo, prestamo).then(respuesta => {
            res.send(respuesta);
        });
    } else {
        let error = {
            error: "Favor de validar los datos de ingreso"
        }
        res.send(error);
    }

});
Router.get('/api/servicios/pp/getplazas', async(req, res) => {
    prestamos.obtenerplazas().then(respuesta => {
        res.send(respuesta);
    });
});
Router.get('/api/servicios/pp/periodicidadespoliticas/:plaza', async(req, res) => {
    const { plaza } = req.params;
    prestamos.periocidadespoliticas(plaza).then(respuesta => {
        res.setHeader('Content-Type', 'application/json');
        res.send(respuesta);
    });
});
Router.get('/api/servicios/pp/getmontoabono/:politica/:monto', async(req, res) => {
    const { politica, monto } = req.params;
    prestamos.getmontoabono(politica, monto).then(respuesta => {
        res.send(respuesta);
    });
});
Router.post('/api/servicios/pp/postgrabarsolicitudcalculadora', async(req, res) => {
    const { Nombre, Telefono, CorreoElectronico, Fecha, CodigoPlaza, MontoSolicitado, CodigoPolitica } = req.body;
    if (Nombre && Telefono && CorreoElectronico && Fecha && CodigoPlaza && MontoSolicitado && CodigoPolitica) {
        prestamos.postgrabarsolicitudcalculadora(Nombre, Telefono, CorreoElectronico, Fecha, CodigoPlaza, MontoSolicitado, CodigoPolitica).then(respuesta => {
            res.send(respuesta);
        });
    }
});

module.exports = Router;