//const statusMonitor = require('express-status-monitor');
const express = require('express');
const cors = require("cors");
let multer = require('multer');
var uniqid = require("uuid");
let upload = multer();
const fs = require('fs');

const libsodium = require('./webapi/libsodium/libsodium.js');
const users = require('./webapi/usuarios/usuarios');
const listEndpoints = require('express-list-endpoints');
const secure = require('./webapi/pagos/3dsecureremates.js');
const pw2remates = require('./webapi/pagos/pw2remates.js');
const email = require('./webapi/emails/sendemailremate');
const emailempeno = require('./webapi/emails/sendemailempeno');
const empeno = require('./webapi/empeno/consultas');
const sms = require('./webapi/sms/sendsms');
const vtas = require('./consola/ventas');
const pagosempeno = require('./consola/empeno');
const procesos = require('./procesos/pagos');

const PORT = process.env.PORT || 3050;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setTimeout(0)
    next();
});


//middlewares de autenticacion por token.....
const mw = require('./Middlewares/secureport.js');
app.use((req, res, next)=>{mw.SecureEntry(req, res, next)});

//******ROUTERS*******//
const rematesRouter = require('./routes/Remates/Remates.js');
const securityRouter = require('./routes/Security/security.js');
const cmsRouter = require('./routes/Cms/cms.js');
const empeñosRouter = require('./routes/Empeño/empeño.js');
const valesRouter = require('./routes/Servicios/vales.js');
const usuariosRouter = require('./routes/users/users.js');
const carritoRouter = require('./routes/Carrito/carrito.js');
const categoriasRouter = require('./routes/Categorias/categorias.js');
const sucursalesRouter = require('./routes/Sucursales/sucursales.js');
const plazasRouter = require('./routes/Plazas/plazas.js');
const prestamosRouter = require('./routes/Prestamos/prestamos.js');
const notificacionesRouter = require('./routes/Notificaciones');

const pagosV2Router = require('./routes/ApiPagosV2');

//security
app.post('/api/security/gettoken', securityRouter);

//cms
app.get('/api/datos/cat', cmsRouter);
app.get('/api/image', cmsRouter);

//Remates
app.get('/api/productos/app/categorias', rematesRouter);
app.get('/api/productos', rematesRouter);
app.get('/api/productos/prueba', rematesRouter);
app.get('/api/productos/:idproducto', rematesRouter);
app.get('/api/productos/:idproducto/precio', rematesRouter);

//EMPENO
app.get('/api/boleta', empeñosRouter);
app.get('/api/boleta/wsp', empeñosRouter);
app.get('/api/calculadoraempeno/calcularprestamo', empeñosRouter);
app.get('/api/calculadoraempeno/plazas', empeñosRouter);
app.get('/api/calculadoraempeno/marcas', empeñosRouter);
app.get('/api/calculadoraempeno/kilatajes', empeñosRouter);
app.post('/api/contacto', empeñosRouter);
app.post('/api/avaluodeAuto', empeñosRouter);

//CATEGORIAS 
app.get('/api/categorias', categoriasRouter);

//SUCURSALES
app.get('/api/sucursales', sucursalesRouter);
app.get('/api/sucursal/:id_slug', sucursalesRouter);

//PLAZAS
app.get('/api/ciudades', plazasRouter);
app.get('/api/obtenercostoenvio/:codigo', plazasRouter);
app.get('/api/obtenercostoenvio/v1/:codigo', plazasRouter);

//VALES
app.get('/api/servicios/vales/consultarlineadecredito', valesRouter);

//PRESTAMOS
app.get('/api/servicios/pp/consultarprestamo', prestamosRouter);
app.get('/api/servicios/pp/getplazas', prestamosRouter);
app.get('/api/servicios/pp/periodicidadespoliticas/:plaza', prestamosRouter);
app.get('/api/servicios/pp/getmontoabono/:politica/:monto', prestamosRouter);
app.post('/api/servicios/pp/postgrabarsolicitudcalculadora', prestamosRouter);
//END ENCRIPTAR
app.get('/api/informacion3dsecure/:reference', (req, res) => {
    const { reference } = req.params
    secure.informacion3dsecure(reference).then(respuesta => {
        res.send(respuesta);
    })
});

app.post('/api/email/reenvioventas', (req, res, next)=>{

})

app.post('/api/sendmailprueba', (req, res, next) => {
    const nombre = req.body.nombre
    const celular = req.body.celular
    const domicilio = req.body.domicilio
    const colonia = req.body.colonia
    const cp = req.body.cp
    const municipio = req.body.municipio
    const estado = req.body.estado
    const instrucciones = req.body.instrucciones
    const articulo = req.body.articulo
    const upc = req.body.upc
    const monto = req.body.monto
    const envio = req.body.envio
    const total = req.body.total;
    const correopersonal = req.body.correopersonal
    const correoenvio = req.body.correoenvio
    const sucursal = req.body.sucursal
    const entregarsucursal = req.body.entregarsucursal?req.body.entregarsucursal == '1'?true:false:false
    const envsuc = req.body.enviosucursal;
    email.sendemail(nombre, celular, domicilio, colonia, 
    cp, municipio, estado, instrucciones, 
    articulo, upc, monto, envio, total, correopersonal, correoenvio, sucursal, entregarsucursal).then((response) => {

    });
    return res.send({ ok: 'ok' })
});
//Notificaciones para app
app.get('/api/notificaciones/procesos/consultarvencidas', notificacionesRouter);
app.get('/api/notificaciones/procesos/consultarvencidas/sms', notificacionesRouter);
app.get('/api/notificacionesmaxilana/getToken', notificacionesRouter);
app.post("/api/notificacionesmaxilana/usuariounico", notificacionesRouter);
app.post("/api/notificacionesmaxilana/general", notificacionesRouter);
app.post("/api/notificacionesmaxilana/registrartopic", notificacionesRouter);
app.post("/api/notificacionesmaxilana/eliminartopic", notificacionesRouter);
//SMS Boletas

app.post('/api/enviarsms', upload.array(), (req, res) => {

    let number = req.query.celular ? req.query.celular : undefined;
    let mensaje = req.query.mensaje ? req.query.mensaje : undefined;

});
app.get('/api/app/validarversion', (req, res) => {

    empeno.obtenerversionapp().then(respuesta => {
        res.send(respuesta);
    })

});
app.get('/api/app/obtenerpreguntasf', upload.array(), (req, res) => {

    empeno.obtenerpreguntasfrecuentas().then(respuesta => {
        res.send(respuesta);
    })

});
app.get('/api/app/obtenerpreguntasporid', upload.array(), (req, res) => {
    empeno.obtenerpreguntasporid(req.query.id).then(respuesta => {
        res.send(respuesta);
    })

});
app.get('/api/app/obtenercomentarios', upload.array(), (req, res) => {
    users.obtenercomentarios().then(respuesta => {
        res.send(respuesta);
    })

});
app.post('/api/app/dejanostuopinion', upload.array(), (req, res) => {
    let asunto = req.body.asunto ? req.body.asunto : '';
    let mensaje = req.body.mensaje ? req.body.mensaje : '';
    let celular = req.body.celular ? req.body.celular : '';
    if (mensaje !== '') {
        users.dejanostucomentario(asunto, mensaje, celular).then(respuesta => {
            res.send(respuesta);
        })
    } else {
        res.send("Error");
    }
});
app.get('/api/app/obtenertarjeta', upload.array(), (req, res) => {
    libsodium.desencriptar("crsdNvciqm7MplMB0+uiIhzaotNux/fu8Y8OkwoBduyiNwE+LFhyZYxZrs0ZIdtillYtYfPg1Eo=").then(respuesta => {
        res.send(respuesta);
    })

});

//REGION USUARIOS
app.post('/api/security/login', usuariosRouter);
app.post('/api/usuarios/login', usuariosRouter);
app.post('/api/usuarios/registro', usuariosRouter)
app.post('/api/usuarios/editarperfil', usuariosRouter)
app.post('/api/usuarios/agregarboleta', usuariosRouter)
app.get('/api/usuarios/estadodecuenta', usuariosRouter)
app.get('/api/usuarios/obtenercodigoregistro', usuariosRouter)
app.get('/api/usuarios/obtenercodigorecuperacion', usuariosRouter);
app.get('/api/usuarios/Validarcodigo/:acccion', usuariosRouter);
app.post('/api/usuarios/validateuser', usuariosRouter);
app.post('/api/usuarios/deleteuser',usuariosRouter)
app.post('/api/usuarios/changepassword', usuariosRouter);
app.post('/api/usuarios/changepass', usuariosRouter);
app.get('/api/usuarios/validarcodigorecuperacion', usuariosRouter)

///CARRITO DE COMPRAS
app.post('/api/carrito/nuevo', carritoRouter);
app.post('/api/carrito/agregararticulo', carritoRouter);
app.post('/api/carrito/eliminararticulo', carritoRouter);
app.get('/api/carrito', carritoRouter);

//

app.post('/api/maxilanasms', upload.array(), (req, res) => {
    if (req.body.celular !== undefined & req.body.mensaje !== undefined) {
        sms.send(req.body.celular, req.body.mensaje).then(response => {
            sms.sendInfoCentral(req.body.celular, req.body.mensaje).then(resp=>{
                res.send(response);
            });
        })
    }
});

app.post('/api/decript', (req, res, next)=>{
    const data = req.body.data;
    libsodium.desencriptar(data).then(resp=>{
        return res.send(resp)
    })
})

app.post('/api/maxilanasmspp', upload.array(), (req, res) => {
    if (req.body.celular !== undefined & req.body.mensaje !== undefined) {
        sms.send(req.body.celular, req.body.mensaje).then(response => {
            res.send(response);
        })

    }

});
app.post('/api/maxilanasms/prestamos', upload.array(), (req, res,) => {
    if (req.body.celular !== undefined & req.body.mensaje !== undefined) {
        sms.sendsmspp(req.body.celular, req.body.mensaje).then(response => {
            res.send(response);
        })
    }
});
app.get('/api/subastasms', (req, res) => {
    
    let mensaje = req.query.sms ? req.query.sms : undefined;
    let celular = req.query.celular ? req.query.celular : undefined;
    sms.send(celular, mensaje).then(response => {
        sms.sendInfoCentral(celular, mensaje);
        
        res.send("200");
    })
    
});
app.get('/api/procesos/pagospendientes', (req, res) => {
    procesos.ejecutarprocesodepagos().then(respuesta => {
        //procesos.ejecutarprocesodepagospp();
        res.send(respuesta);
    }).catch((error) => {
        return res.send({ error: error.message });
    });
});

app.get('/api/consola/pagos/ventas', (req, res) => {
    var tipo = req.query.tipo ? req.query.tipo : 1;
    var upc = req.query.upc ? req.query.upc : 0;
    vtas.obtenerventas(tipo, upc).then(respuesta => {
        res.send(respuesta);
    })
});
app.post('/api/consola/pagos/empeno', upload.array(), (req, res) => {
    var bol = req.body.Boleta;
    var CodigoAuth = req.body.CodigoAuth;
    var Referencia = req.body.Referencia;
    pagosempeno.Obtenerpagos(bol, CodigoAuth, Referencia).then(response => {
        res.send(response);
    })
})
app.post('/api/consola/pagos/control', upload.array(), (req, res) => {
    var control_number = req.body.control;
    pagosempeno.obtenerinfo3d(control_number).then(response => {
        res.send(response);
    });
})
app.post('/api/consola/pagos/ppyvales', upload.array(), (req, res) => {
    
})




app.post('/api/subastas/encrypt', upload.array(), (req, res) => {
    
    var tjt = req.body.datacard ? req.body.datacard : undefined;
    
    var part1Tjt = (tjt.substring(0, 8));
    var part2Tjt = (tjt.substring(8, 16));
    
    
    var mes = req.body.mm ? req.body.mm : undefined;
    var anio = req.body.aa ? req.body.aa : undefined
    
    libsodium.encriptar(part1Tjt).then(respuesta => {
        var tarjeta = respuesta;
        libsodium.encriptar(part2Tjt).then(respuesta => {
            var tarjetaPart2 = respuesta;
            libsodium.encriptar(mes).then(respuesta => {
                var expmes = respuesta;
                libsodium.encriptar(anio).then(respuesta => {
                    var expanio = respuesta;
                    let resp = {
                        data_ccnumOne: tarjeta,
                        data_ccnumtwo: tarjetaPart2,
                        data_ccexpmes: expmes,
                        data_ccexpanio: expanio
                    }
                    res.send(resp);

                })
            })
        })
    })
    
    
});
app.post('/api/subastas/decrypt', upload.array(), (req, res) => {

    var tjt = req.body.datacardOne ? req.body.datacardOne : undefined;
    var tjt2 = req.body.datacardTwo ? req.body.datacardTwo : undefined;
    var mes = req.body.mm ? req.body.mm : undefined;
    var anio = req.body.aa ? req.body.aa : undefined;
    
    libsodium.desencriptar(tjt).then(respuesta => {
        var part1Tjr = "4556" + respuesta + "0000";
        
        libsodium.desencriptar(tjt2).then(respuesta => {
            var part2Tjr = "4556" + respuesta + "0000";
            libsodium.desencriptar(mes).then(respuesta => {
                var expmes = respuesta;
                libsodium.desencriptar(anio).then(respuesta => {
                    var expanio = respuesta;
                    let resp = {
                        data_ccnumOne: part1Tjr,
                        data_ccnumtwo: part2Tjr,
                        data_ccexpmes: expmes,
                        data_ccexpanio: expanio
                    }
                    res.send(resp);
                })
            })
        })
    })

});

/////// PRUEBAS SANTOS ////////////////
app.post('/api/testguardado', async (req, res, next) => {
    try {
        const data = await pw2remates.Obtenerdatos('333444555666777888', '02', '12341234123412341234123412341', '44321223443435wf1234123412', '200', 'VISA');
        return res.send(data);
    } catch (error) {
        return res.send({error: error.message});
    }
});
///////////////////////////////////////

//ENRUTADORES PROVISIONALES (PRIMERO SE HARÁN CON LO NUEVO DE PAGOS)
const router3dsecure = require('./routes/3DSecure/3DSecure');
const router2dsecure = require('./routes/2DSecure/2DSecure');
const routerPayworks = require('./routes/payworks/pagos');
const routerSaveData = require('./routes/storage/datastorage');

/****************** DATA STORAGE   ************* */
app.post('/api/storage/savedata', routerSaveData);
app.post('/api/storage/deldata', routerSaveData);
app.post('/api/storage/getdata', routerSaveData);

/**************VERSION 2.0 PAYWORKS **************/
//PAGOS
/******** BEGIN PAYWORKS 3DSECURE 2.0 **********/
app.post('/api/card/checkcreditcard', router3dsecure);
app.post('/api/pagos/3dsecure/app/producto/v1', router3dsecure);
app.post('/api/pagos/3dsecure/app/boleta/v1', router3dsecure);
app.post('/api/pagos/3dsecure/web/pp/v1', router3dsecure);
app.post('/api/pagos/3dsecure/web/vales/v1', router3dsecure);
app.post('/api/pagos/3dsecure/web/boleta/v1', router3dsecure);
app.post('/api/pagos/3dsecure/web/productos/v1', router3dsecure);
app.post('/api/pagos/3dsecure/rechazos', router3dsecure);

app.post('/api/retorno3dSecure', (req, res, next)=>{
    const data = {
        ...req.body,
        cardtype: req.query.cardtype,
    }
    return res.send(data);
}) 

/******* END PAYWORKS 3DSECURE 2.0 ************/

/************** BEGIN PAYWORKS 2.0 **************/
app.post('/api/pagos/2dsecure/pruebaguardado', router2dsecure);
app.post('/api/pagos/2dsecure/web/boletas', router2dsecure);
app.post('/api/pagos/2dsecure/web/producto', router2dsecure);
app.post('/api/pagos/2dsecure/vales', router2dsecure);
app.post('/api/pagos/2dsecure/pp', router2dsecure);
app.post('/api/pagos/2dsecure/producto/v1', router2dsecure);
app.post('/api/pagos/2dsecure/boletas/v1', router2dsecure);

/************** END PAYWORKS 2.0 **************/

/************** CANCELAR PAGO ****************/
app.post('/api/pagos/cancelaciones', routerPayworks);

//Todas las rutas
app.get('/api/', (req, res) => {
    res.send(listEndpoints(app));
});

app.get('/api/fecha', (req, res) => {
    let Cliente = 'ERICK PAUL GARCIA RAMOS'
    let codigosucursal = '1'
    let sucnom = 'Matriz'
    let boleta = '120222'
    let monto = '122.00'
    let codigo_aut = '789521'
    let referencia = '510919698089'
    let fecha = '2021-09-08 09:33:32'
    let CorreoPersonal = 'arthur.borboa.r@gmail.com'
    let correoelectronico = 'fnava@maxilana.com'
    emailempeno.sendemail(Cliente, codigosucursal, sucnom, boleta, monto, codigo_aut, referencia, fecha, CorreoPersonal, correoelectronico);
    return res.send({ ok: 'ok' });
});

app.get('/api/reset/', (req, res) => {
    var id = uniqid.v4();
    fs.writeFile('./tmp/restart.txt', id, 'utf-8', function (err, data) {
        if (err) throw err;
        return res.send("LA API SE REINICIÓ CON ÉXITO");
    });
});

function verifyToken(req, res, next) {
    //Get Auth header value  
    const bearerHearder = req.headers['authorization'];
    //check if bearer is undefined  
    if (typeof bearerHearder != 'undefined') {
        //split at the space  
        const bearer = bearerHearder.split(' ');
        //Get the token from array  
        const bearerToken = bearer[1];
        // set the token  
        req.token = bearerToken;
        //Next middleware  
        next();

    } else {
        //Forbidden  
        return res.send(403);
    }
}

///////////////// CONFIG PARA SOCKET.IO /////////////////////
// const httpServer = createServer(app);
// const io = new Server(httpServer);
// io.engine.generateIdentity = (req)=>{return uniqid.v4()}
// io.on('connection', (socket)=>{
//     console.log(socket)
// })

// httpServer.listen(PORT, ()=>{
//     console.log('server running on port ' + PORT)
// })
///////////////////////////////////////////////////////////

const server = app.listen(PORT, () => console.log('server running on port ' + PORT))
        .on('error', (error)=>{
            console.log(error.message);
        });

// httpServer.keepAliveTimeout=(61*1000);
// httpServer.headersTimeout=((61*1000)+1000);
server.keepAliveTimeout = (61*1000);
server.headersTimeout = ((61*1000)+1000);


///ANTES DE CORRER LA APLICACIÓN EN WINDOWS CORRER LA SIGUIENTE LINEA DECÓDIGO//
// npm install --platform=win32 --arch=x64 sharp // ESTO PARA QUE CAMBIE EL ENTORNO DE SHARP Y PUEDA CORRER
//AL SUBIR AL PRODUCCIÓN , CORRER LA SIGUIENTE LINEA //
// npm install --platform=linux --arch=x64 sharp // ESTO POR QUE EL SERVIDOR SE ENCUENTRA EN LINUX.
