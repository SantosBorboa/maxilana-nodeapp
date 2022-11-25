const express = require('express');
const Router = express.Router();
const sms = require('../../webapi/sms/sendsms');

Router.post('/api/maxilanasms',  (req, res) => {
    if (req.body.celular !== undefined & req.body.mensaje !== undefined) {
        sms.send(req.body.celular, req.body.mensaje).then(response => {
            sms.sendInfoCentral(req.body.celular, req.body.mensaje).then(resp=>{
                res.send(response);
            });
        })
    }
});
Router.post('/api/maxilanasmspp',  (req, res) => {
    if (req.body.celular !== undefined & req.body.mensaje !== undefined) {
        sms.send(req.body.celular, req.body.mensaje).then(response => {
            res.send(response);
        })
    }
});
Router.post('/api/maxilanasms/prestamos',  (req, res,) => {
    if (req.body.celular !== undefined & req.body.mensaje !== undefined) {
        sms.sendsmspp(req.body.celular, req.body.mensaje).then(response => {
            res.send(response);
        })
    }
});
Router.get('/api/subastasms', (req, res) => {    
    let mensaje = req.query.sms ? req.query.sms : undefined;
    let celular = req.query.celular ? req.query.celular : undefined;
    sms.send(celular, mensaje).then(response => {
        sms.sendInfoCentral(celular, mensaje);
        res.send("200");
    })    
});
Router.post('/api/enviarsms', (req, res) => {
    let number = req.query.celular ? req.query.celular : undefined;
    let mensaje = req.query.mensaje ? req.query.mensaje : undefined;
});

module.exports = Router;