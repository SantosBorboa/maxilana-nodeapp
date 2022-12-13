const express = require('express');
const Router = express.Router();

const jwt = require('jsonwebtoken');
const con = require("../../db/conexion");
const vtas = require('../../consola/ventas')
const cnn = require('mysql');
const { configMaxilanaDB } = require('../../db/config')

Router.post('/api/pagos/cancelaciones', async (req, res, next) => {
    const reference = req.body.reference ? req.body.reference : undefined;
    const user = req.authorization? req.authorization.user? req.authorization?.user : '':'';

    if (!reference) { return res.send({ error: 'La referencia no puede ser nula ni vacía.' }); }

    try {
        //verificamos si existe la cancelación y si existe regresar error.
        const datosRespPW2 = await datosPW2(reference);
        // if (!datosRespPW2) {
        //     return res.send({ error: `La cancelación al pago ${reference} no se puede aplicar a movimientos inexistentes.` });
        // }

        //realizamos la cancelación del pago.
        const respuesta = await vtas.cancelarpago(reference);
        // const canc = await insertaCancelacion(respuesta, datosRespPW2, user); //inserta independientemente si es aprobado o declinado.
        if (respuesta.resultado_payw == 'A') {
            return res.send(respuesta);
        } else {
            return res.send({
                error: 'Falló el proceso de cancelación.',
                respuestaPW2: respuesta,
            })
        }
    } catch (error) {
        return res.send({ error: error.message });
    }


})

//callbacks
const insertaCancelacion = async (ref, datos, usuario) => {
    return new Promise ((resolve, reject) => {
        const queryInsert = `
        insert into respuestaspw2cancelaciones 
        (reference, control_number, cust_req_date,
        auth_req_date,auth_rsp_date,cust_rsp_date,
        payw_result,auth_result,payw_code,
        auth_code,text,card_holder,
        issuing_bank,card_brand,card_type,
        tarjeta,correoelectronico,monto,
        codigosucursal,boleta,enviado,
        aplicacomision,usuario) values 
        ('${ref.referencia}', '${datos.control_number}', '${ref.fecha_req_cte}', 
        '${datos.auth_req_date}', '${datos.auth_rsp_date}', '${datos.cust_rsp_date}', 
        '${datos.payw_result}', '${datos.auth_result}', '${datos.payw_code}', 
        '${ref.codigo_aut}', '${ref.texto}', '${datos.card_holder}', 
        '${datos.ussuing_bank}', '${datos.card_brand}', '${datos.card_type}', 
        '${datos.tarjeta}', '${datos.correoelectronico}', ${datos.monto}, 
        ${datos.codigosucursal}, ${datos.boleta}, ${datos.enviado}, 
        ${datos.aplicacomision}, '${usuario}')`;
        
        con.connection.query(queryInsert, (error, results, fields) => {
            if (error) { return reject(error) };
            return resolve(true);
        })
    })
}

const verificarUsuario = (user, password) => {
    return new Promise((resolve, reject) => {
        resolve(false);
    })
}
const datosPW2 = (reference) => {
    return new Promise(async (resolve, reject) => {
        try {
            //prestamos y vales
            const connection = await cnn.createConnection(configMaxilanaDB);
            await connection.connect()
            const query = `select * from respuestaspp_pw2 where reference = '${reference}'`;
            const query2 = `select * from respuestaspw2 where reference = '${reference}'`;
            const query3 = `select * from respuestaspw2remates where reference = '${reference}'`;
            connection.query(query, (errorq, results, fields) => {
                if (errorq) {
                    connection.end((errorend)=>{
                        return reject(errorq) 
                    });
                }
                const res1 = results;
                connection.query(query2, (errorq2, results2, fields) => {
                    if (errorq2) {
                        connection.end((errorend)=>{
                            return reject(errorq2) 
                        });
                    }
                    const res2 = results2;
                    connection.query(query3, (errorq3, results3, fields) => {
                        if (errorq3) {
                            connection.end((errorend)=>{
                                return reject(errorq3) 
                            });
                        }
                        const res3 = results3;;
                        connection.end((errorend)=>{
                            const returnValue = res1.length > 0 ?res1[0]:res2.length > 0?res2[0]:res3.length > 0?res3[0]:undefined;
                            resolve(returnValue);
                        });
                    });
                });
            });
        } catch (error) {
            resolve({ error: error.message });
        }
    })
}

module.exports = Router;