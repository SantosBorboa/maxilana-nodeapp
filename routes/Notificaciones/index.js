const express = require('express')
const Router = express.Router()

const ConsultarNotificaciones = require('../../notificaciones/consultas');
const Notification = require("../../notificaciones/notificaciones");
const GenerateToken = require("../../generateToken.js");

Router.get('/api/notificaciones/procesos/consultarvencidas', (req, res) => {
    ConsultarNotificaciones.cBoletasvencidas().then(respuesta => {
        res.send(respuesta);
    })
});
Router.get('/api/notificaciones/procesos/consultarvencidas/sms', (req, res) => {
    ConsultarNotificaciones.ObtenerMensajesParaNotificar().then(respuesta => {
        res.send(respuesta);
    })
});
Router.get('/api/notificacionesmaxilana/getToken', function (req, res) {
    GenerateToken.getAccessToken()
        .then((token) => res.send(token))
        .catch((err) => res.send(err))
})
Router.post("/api/notificacionesmaxilana/usuariounico",  function (req, res) {
    var Token = req.body.TokenUsr;
    var Title = req.body.Title;
    var Message = req.body.Message;
    const data = {
        tokenId: Token,
        titulo: Title,
        mensaje: Message
    }
    Notification.sendPushToOneUser(data);
    res.send("Sending Notification to One user...");
});
Router.post("/api/notificacionesmaxilana/general",  function (req, res) {
    var Title = req.body.Title;
    var Message = req.body.Message;
    var Topic = req.body.Topic;
    const data = {
        topic: Topic,
        titulo: Title,
        mensaje: Message
    }
    Notification.sendPushToTopic(data);
    res.send("Sending Notification to a Todos...");
});
Router.post("/api/notificacionesmaxilana/registrartopic",  (req, res) => {
    var Topics = req.body.Topics;
    var Tokens = req.body.TokenUsarios;
    res.send("200");
    Notification.registertoTopic(Tokens, Topics);
})
Router.post("/api/notificacionesmaxilana/eliminartopic",  (req, res) => {
    var Topics = req.body.Topics;
    var Tokens = req.body.TokenUsarios;
    Notification.unRegisterTopic(Tokens, Topics);
    res.send("200");
})

module.exports = Router