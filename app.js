//const statusMonitor = require('express-status-monitor');
const express = require('express');
const { engine } = require('express-handlebars');

const cors = require("cors");

let multer = require('multer');
let upload = multer();

const secure = require('./webapi/pagos/3dsecureremates.js');
const emailempeno = require('./webapi/emails/sendemailempeno');
const procesos = require('./procesos/pagos');
const listEndpoints = require('express-list-endpoints');

const PORT = process.env.PORT || 3050;
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setTimeout(0)
    next();
});

//view engine middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//middlewares de autenticacion por token.....
const mw = require('./Middlewares/secureport.js');
//app.use((req, res, next) => { mw.Logger(req, res, next) })
// app.use((req, res, next) => { mw.SecureEntry(req, res, next) });

app.get('/', (req, res, next) => {
    res.render('home', {layout: false});
});

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
const appRouter = require('./routes/App');
const smsRouter = require('./routes/Sms');
const consolaRouter = require('./routes/Consola');
const utilsRouter = require('./routes/Utils');
const router3dsecure = require('./routes/3DSecure');
const router2dsecure = require('./routes/2DSecure/2DSecure');
const routerPayworks = require('./routes/payworks/pagos');
const routerSaveData = require('./routes/storage/datastorage');
const pagosV2Router = require('./routes/ApiPagosV2');
const mailRouter = require('./routes/Mails');
const testMultiRouter = require('./routes/testmulti');

//utils
app.post('/api/mail/mailtesting', mailRouter)
app.post('/api/testguardado', utilsRouter);
app.post('/api/decript', utilsRouter);
app.post('/api/subastas/encrypt', utilsRouter);
app.post('/api/subastas/decrypt', utilsRouter);
app.post('/api/email/reenvio', utilsRouter);
app.post('/api/sendmailprueba', utilsRouter);
app.post('/api/utils/xmlconverter', utilsRouter);

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

//Notificaciones para app
app.get('/api/notificaciones/procesos/consultarvencidas', notificacionesRouter);
app.get('/api/notificaciones/procesos/consultarvencidas/sms', notificacionesRouter);
app.get('/api/notificacionesmaxilana/getToken', notificacionesRouter);
app.post("/api/notificacionesmaxilana/usuariounico", notificacionesRouter);
app.post("/api/notificacionesmaxilana/general", notificacionesRouter);
app.post("/api/notificacionesmaxilana/registrartopic", notificacionesRouter);
app.post("/api/notificacionesmaxilana/eliminartopic", notificacionesRouter);

app.get('/api/app/validarversion', appRouter);
app.get('/api/app/obtenerpreguntasf', appRouter);
app.get('/api/app/obtenerpreguntasporid', appRouter);
app.get('/api/app/obtenercomentarios', appRouter);
app.post('/api/app/dejanostuopinion', appRouter);
app.get('/api/app/obtenertarjeta', appRouter);

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
app.post('/api/usuarios/deleteuser', usuariosRouter)
app.post('/api/usuarios/changepassword', usuariosRouter);
app.post('/api/usuarios/changepass', usuariosRouter);
app.get('/api/usuarios/validarcodigorecuperacion', usuariosRouter)

///CARRITO DE COMPRAS
app.post('/api/carrito/nuevo', carritoRouter);
app.post('/api/carrito/agregararticulo', carritoRouter);
app.post('/api/carrito/eliminararticulo', carritoRouter);
app.get('/api/carrito', carritoRouter);

///// SMS
app.post('/api/maxilanasms', smsRouter);
app.post('/api/maxilanasmspp', smsRouter);
app.post('/api/maxilanasms/prestamos', smsRouter);
app.get('/api/subastasms', smsRouter);
app.post('/api/enviarsms', smsRouter);

app.get('/api/procesos/pagospendientes', (req, res) => {
    procesos.ejecutarprocesodepagos().then(respuesta => {
        //procesos.ejecutarprocesodepagospp();
        res.send(respuesta);
    }).catch((error) => {
        return res.send({ error: error.message });
    });
});

/// CONSOLA /////////
app.post('/api/consola/login', consolaRouter);
app.get('/api/consola/pagos/ventas', consolaRouter);
app.post('/api/consola/pagos/ventas/mysql', consolaRouter);
app.post('/api/consola/pagos/empeno', consolaRouter);
app.post('/api/consola/pagos/control', consolaRouter);
app.post('/api/consola/pagos/ppyvales', consolaRouter);

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

app.post('/api/pagos/3dsecure/web/subastas', router3dsecure);
app.get('/api/pagos/3dsecure/envio', router3dsecure);
app.post('/api/pagos/3dsecure/retorno', router3dsecure);

app.post('/api/retorno3dSecure', (req, res, next) => {
    const data = {
        ...req.body,
        cardtype: req.query.cardtype,
    }
    return res.send(data);
})

/******* END PAYWORKS 3DSECURE 2.0 ************/

/************** BEGIN PAYWORKS 2.0 **************/
app.post('/api/pagos/2dsecure/reenviocorreo', router2dsecure);
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
    if (!req.authorization) { return res.send({ error: 'No autorizado a usar el endpoint.' }) };
    return res.send(listEndpoints(app));
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

app.get('/api/reset/', utilsRouter);

app.post('/api/smstest', (req, res, next)=>{return res.send({ok:'ok'})});

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

const server = app.listen(PORT, () => console.log('server running on port ' + PORT))
    .on('error', (error) => {
        console.log(error.message);
    });

server.keepAliveTimeout = 0;
server.headersTimeout = 0;


///ANTES DE CORRER LA APLICACIÓN EN WINDOWS CORRER LA SIGUIENTE LINEA DECÓDIGO//
// npm install --platform=win32 --arch=x64 sharp // ESTO PARA QUE CAMBIE EL ENTORNO DE SHARP Y PUEDA CORRER
//AL SUBIR AL PRODUCCIÓN , CORRER LA SIGUIENTE LINEA //
// npm install --platform=linux --arch=x64 sharp // ESTO POR QUE EL SERVIDOR SE ENCUENTRA EN LINUX.
