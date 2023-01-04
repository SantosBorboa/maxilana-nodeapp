const express = require('express')
const Router = express.Router()
const vtas = require('../../consola/ventas');
const pagosempeno = require('../../consola/empeno');
const users = require('../../webapi/usuarios/usuarios');
const soap = require("../../node_modules/soap");
const utf8 = require('utf8');
const con = require('../../db/conexion');

Router.post('/api/consola/login', (req, res) => {
    const { user, password } = req.body
    if (user !== undefined & password !== undefined) {
        UsuarioCorrecto(user, password).then(respuesta => {
            if(respuesta.error){return res.send(respuesta.error)}
            const objResp = {
                ...respuesta
            }
            res.send(objResp);
        }).catch(error=>{return res.send(error)});
    } else {
        return res.send({error:'Favor de validar la información enviada.'})
    }
})
Router.post('/api/consola/pagos/ventas/mysql', async (req, res, next)=>{
    try {
        const stQuery = `select i.id, i.idPrincipal, resp.reference, i.codigosucursal, i.upc, tds.status,
        tds.cardtype, ienv.nombre, ienv.celular, ienv.correoelectronico,
        ienv.direccion, ienv.codigopostal, ienv.colonia,ienv.municipio,ienv.municipio,
        ienv.estado,ienv.fecha,ienv.instrucciones,plz.correoparaconfirmaciondecompra,
        suc.correoelectronico as correosucursal 
        from informacionTransaccionVentas i,
        informacion3dsecure tds, 
        informacionEnvioArticulos ienv,
        respuestaspw2remates resp,
        sucursales suc,
        plazas plz
        where tds.reference = i.idPrincipal
        and ienv.id = i.idPrincipal
        and suc.numero = i.codigosucursal
        and plz.codigo = suc.ciudad
        and resp.control_number = i.idPrincipal
        and resp.payw_result = 'A' and resp.text = 'Aprobado'
        order by i.fecha desc`;
        const resp = await con.connection.promise().query(stQuery)
        return res.send(resp);
    } catch (error) {
        return res.send({error})
    }
});
Router.get('/api/consola/pagos/ventas', (req, res) => {
    var tipo = req.query.tipo ? req.query.tipo : 1;
    var upc = req.query.upc ? req.query.upc : 0;
    vtas.obtenerventas(tipo, upc).then(respuesta => {
        res.send(respuesta);
    })
});
Router.post('/api/consola/pagos/empeno',  (req, res) => {
    var bol = req.body.Boleta?req.body.Boleta:'0';
    var CodigoAuth = req.body.CodigoAuth?req.body.CodigoAuth : '0';
    var Referencia = req.body.Referencia?req.body.Referencia : '0';
    pagosempeno.Obtenerpagos(bol, CodigoAuth, Referencia)
    .then(response => {
        return res.send(response); 
    })
    .catch(err => {return res.send(err);});
})
Router.post('/api/consola/pagos/control',  (req, res) => {
    var control_number = req.body.control;
    pagosempeno.obtenerinfo3d(control_number).then(response => {
        res.send(response);
    })
    .catch(err => {return res.send(err);});
})
Router.post('/api/consola/pagos/ppyvales',  (req, res) => {
    
})
const UsuarioCorrecto = async (usuario, contraseña) => {
    return new Promise((resolve, reject) => {
        try {
            if (usuario !== undefined & contraseña !== undefined) {
                const args = { 
                    strUsuario: utf8.encode(usuario), 
                    strContrasena: utf8.encode(contraseña),
                }
                soap.createClient('https://grupoalvarez.com.mx/wsiniciosesion/serviciosiniciosesion.asmx?WSDL', (error, client) => {
                    if (error) { reject(error) }
                    client.UsuarioCorrecto(args, (error, response) => {
                        if (error) { reject(error) }
                        resolve(response);
                    })
                })
            } else {
                resolve(false);
            }
        } catch (error) {

        }
    });
};
module.exports = Router