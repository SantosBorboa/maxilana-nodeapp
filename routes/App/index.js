const express = require('express')
const Router = express.Router()

const libsodium = require('../../webapi/libsodium/libsodium.js');
const users = require('../../webapi/usuarios/usuarios');
const empeno = require('../../webapi/empeno/consultas');

Router.get('/api/app/validarversion', (req, res) => {
    empeno.obtenerversionapp()
    .then(respuesta => {
        return res.send(respuesta);
    })
    .catch(err => {return res.send(err);});
});
Router.get('/api/app/obtenerpreguntasf',  (req, res) => {
    empeno.obtenerpreguntasfrecuentas()
    .then(respuesta => {
        return res.send(respuesta);
    })
    .catch(error=> {return res.send(error);});
});
Router.get('/api/app/obtenerpreguntasporid',  (req, res) => {
    empeno.obtenerpreguntasporid(req.query.id)
    .then(respuesta => {
        return res.send(respuesta);
    })
    .catch(error=>{return res.send(error)})
});
Router.get('/api/app/obtenercomentarios',  (req, res) => {
    users.obtenercomentarios()
    .then(respuesta => {
        return res.send(respuesta);
    })
    .catch(error => {return res.send(error)})
});
Router.post('/api/app/dejanostuopinion',  (req, res) => {
    const {asunto, mensaje, celular} = req.body;
    if (mensaje && mensaje !== '') {
        users.dejanostucomentario(asunto, mensaje, celular)
        .then(respuesta => {
            return res.send(respuesta);
        })
        .catch(error => {return res.send(error)})
    } else {
        return res.send("Error");
    }
});
Router.get('/api/app/obtenertarjeta',  (req, res) => {
    libsodium.desencriptar("crsdNvciqm7MplMB0+uiIhzaotNux/fu8Y8OkwoBduyiNwE+LFhyZYxZrs0ZIdtillYtYfPg1Eo=").then(respuesta => {
        res.send(respuesta);
    })

});

module.exports = Router;