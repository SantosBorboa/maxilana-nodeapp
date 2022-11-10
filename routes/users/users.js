const express = require('express');
const Router = express.Router();
const users = require('../../webapi/usuarios/usuarios');

Router.post('/api/security/login', (req, res, next) => {
    return next();
});
Router.post('/api/usuarios/eliminar', (req, res, next) => {
    const usuario = req.body.usuario ? req.body.usuario : undefined;
    if(!usuario) return res.send({error: 'No se ha especificado el usuario a eliminar.'})
    return res.send({error:'Próximamente.'})
})

module.exports = Router;