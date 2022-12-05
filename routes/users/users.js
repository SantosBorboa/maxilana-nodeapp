const express = require('express');
const Router = express.Router();
const users = require('../../webapi/usuarios/usuarios');

Router.post('/api/usuarios/eliminar', (req, res, next) => {
    const { usuario } = req.body;
    if(!usuario) return res.send({error: 'No se ha especificado el usuario a eliminar.'})
    return res.send({error:'Próximamente.'})
});
Router.post('/api/security/login', (req, res, next) => {
    return res.send({error: 'no hay nada'})
});
Router.post('/api/usuarios/login', (req, res) => {
    const { user, password } = req.body
    if (user !== undefined & password !== undefined) {
        const regex = /^[0-9]*$/;
        const correo = regex.test(user)?'NoCorreo':user;
        const celular = regex.test(user)?user:0;
        users.consultarLogin(celular, correo, password).then(respuesta => {
            if(respuesta.error){return res.send(respuesta.error)}
            const objResp = {
                ...respuesta,
                MonederoElectronico: parseFloat(respuesta.MonederoElectronico),
                Limiteparacomision: parseFloat(respuesta.Limiteparacomision),
                PagoMultiple: respuesta.PagoMultiple=='0'?false:true,
            }
            res.send(objResp);
        }).catch(error=>{return res.send(error)});
    } else {
        return res.send({error:'Favor de validar la información enviada.'})
    }
});
Router.post('/api/usuarios/registro',  (req, res) => {
    let Apellidop = req.body.Apellidop ? req.body.Apellidop : undefined;
    let Apellidom = req.body.Apellidom ? req.body.Apellidom : undefined;
    let Nombre = req.body.Nombre ? req.body.Nombre : undefined;
    let Celular = req.body.Celular ? req.body.Celular : undefined;
    let Correo = req.body.Correo ? req.body.Correo : undefined;
    let Contrasena = req.body.Contrasena ? req.body.Contrasena : undefined;

    users.RegistrarCliente(Apellidop, Apellidom, Nombre, Celular, Correo, Contrasena).then(respuesta => {
        return res.send(respuesta);
    }).catch(error => {return res.send(error)});
})
Router.post('/api/usuarios/editarperfil', async (req, res) => {
    const {  Apellidop, Apellidom, Nombre, Celular, Correo, Usuario } = req.body
    try {
        const userResp = await users.ConsultarTelefono(Usuario) 
        const resp = await users.EditarCliente(Usuario, Apellidop, Apellidom, Nombre, userResp.Celular, Correo, undefined)
        return res.send(resp)
    } catch (error) {
        return res.send(error)
    }
})
Router.post('/api/usuarios/agregarboleta',  (req, res) => {
    let usuario = req.body.usuario ? req.body.usuario : undefined;
    let boleta = req.body.boleta ? req.body.boleta : undefined;
    let letra = req.body.letra ? req.body.letra : undefined;
    let prestamo = req.body.prestamo ? req.body.prestamo : undefined;

    users.agregarboleta(usuario, boleta, letra, prestamo).then(respuesta => {
        res.send(respuesta);
    });
})
Router.get('/api/usuarios/estadodecuenta',  (req, res) => {
    let user = req.query.codigousuario ? req.query.codigousuario : undefined;

    users.ObtenerSaldoBoleta(user).then(respuesta => {
        res.send(respuesta);
    });

})
Router.get('/api/usuarios/obtenercodigoregistro',  (req, res) => {
    celular = req.query.celular ? req.query.celular : undefined;
    users.ObtenerCodigoRegistro(celular).then(respuesta => {
        if (respuesta != undefined) {
            let Mensaje = "Tu codigo de verificacion Maxilana es: " + respuesta.Codigo;
            sms.send(celular, Mensaje);
            sms.sendInfoCentral(celular, Mensaje);
            res.send(respuesta);
        } else {
            let error = {
                mensaje: "El celular ingresado ya se encuentra registrado."
            }
            res.send(error);
        }

    })
})
Router.get('/api/usuarios/obtenercodigorecuperacion',  (req, res) => {
    let celular = req.query.celular ? req.query.celular : 0;
    let email = req.query.email ? req.query.email : "Novalido";
    users.ObtenerCodigoFgtPassword(celular, email).then(respuesta => {
        if (respuesta != undefined) {
            let Mensaje = "Se genero el codigo de recuperacion de contraseña: " + respuesta.CodigoGenerado;
            sms.send(respuesta.Celular, Mensaje);
            sms.sendInfoCentral(respuesta.Celular, Mensaje);
            delete respuesta.CodigoGenerado;
            res.send(respuesta);
        } else {
            let error = {
                mensaje: "El celular ingresado no se encuentra registrado."
            }
            res.send(error);
        }
    });
});
Router.get('/api/usuarios/Validarcodigo/:acccion',  (req, res) => {
    const { acccion } = req.params
    let user = req.query.user ? req.query.user : 0;
    let codigo = req.query.codigo ? req.query.codigo : "Novalido";
    if (acccion == 'Alta') {
        if (user == 'undefined') {
            user = 0;
        }
        users.Validarcodigo(user, codigo, 2).then(respuesta => {

            res.send(respuesta);

        });
    } else {
        users.Validarcodigo(user, codigo, 1).then(respuesta => {

            res.send(respuesta);

        });
    }

});
Router.post('/api/usuarios/validateuser', (req, res, next) => {
    const usuario = req.body.usuario ? req.body.usuario : 0;
    const correo = 'NoCorreo';
    const contrasena = req.body.password ? req.body.password : undefined;
    if (usuario !== 0 && contrasena !== undefined) {
        users.GetUser(usuario, correo, contrasena).then(respuesta => {
            if(respuesta.length == 0){
                res.send({response:false})
            }
            res.send({response:true});
        }).catch((err)=>{return res.send(err)});
    } else {
        res.send({response:false});
    }
});
Router.post('/api/usuarios/deleteuser',(req, res, next)=>{
    const codigousuario = req.body.codigousuario ? req.body.codigousuario: undefined;
    if(!codigousuario){return res.send({error:'No se ha especificado el usuario a eliminar.'})}


})
Router.post('/api/usuarios/changepassword', (req, res, next)=>{
    let usuario = req.body.usuario ? req.body.usuario : 0;
    let contrasena = req.body.password ? req.body.password : undefined;
    if (usuario !== 0 && contrasena !== undefined) {
        users.CambiarContraseñaUser(usuario, contrasena).then(respuesta => {
            res.send(respuesta);
        });
    } else {
        let ress = {
            response: false
        }
        res.send(ress);
    }
});
Router.post('/api/usuarios/changepass',  (req, res) => {
    let usuario = req.body.usuario ? req.body.usuario : 0;
    let contrasena = req.body.password ? req.body.password : undefined;
    if (usuario !== 0 && contrasena !== undefined) {
        users.CambiarContraseña(usuario, contrasena).then(respuesta => {

            res.send(respuesta);

        });
    } else {

        let ress = {
            response: false
        }
        res.send(ress);
    }

});
Router.get('/api/usuarios/validarcodigorecuperacion', (req, res) => {
})
module.exports = Router;