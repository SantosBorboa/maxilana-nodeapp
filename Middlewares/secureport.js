const jwt = require('jsonwebtoken');
const jwtConf = require('../config/general');
const fs = require('fs');
const path = require('path');

const Logger = (req, res, next) => {
    if (rutasLogger(req.originalUrl)) {
        const date = new Date()
        const fileName = `../Logs/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}.log`
        const pathFile = path.join(__dirname, fileName)
        const o = {
            hora: date.toLocaleTimeString(),
            address: res.connection.remoteAddress,
            port: res.connection.remotePort,
            family: res.connection.remoteFamily,
            url: req.originalUrl,
            body: req.body,
            headers: req.headers,
            query: req.query,
        };
        fs.appendFile(pathFile, `${JSON.stringify(o)}\n`, (error) => {
            if (error) { console.log(error) }
        });
    }
    return next();
}
const SecureEntry = (req, res, next) => {
    const verificarRuta = rutasRequeridas(req.originalUrl);
    if (verificarRuta) {
        try {
            const authToken = req.headers['authorization'];
            //delete req.headers.authorization;
            if (!authToken) { return res.status(400).send({ error: 'El token de autorización no ha sido proporcionado.' }) }
            jwt.verify(authToken, jwtConf.jwtSecretKey, async (error, data) => {
                if (error) {
                    return res.send({ error: error.message });
                }
                const dataToken = await jwt.verify(authToken, jwtConf.jwtSecretKey);
                if (dataToken === undefined || dataToken === null) { return res.status(400).send({ error: 'El token de autorización no es válido.' }) }

                const usuarioValido = usuariosValidos(dataToken.user);
                if (!usuarioValido) { return res.status(401).send({ error: 'El usuario no está autorizado a usar el end point.' }) }

                //VERIFICAMOS LA EXPIRACIÓN DEL TOKEN DE SEGURIDAD.
                const dt = new Date();
                const dt2 = new Date(dataToken.date);
                if (dt > dt2) {
                    return res.status(401).send({
                        error: 'El token de autorización ha expirado.'
                    })
                };

                const adminuser = dataToken.user == '@adminMaxilana2022@' ? 'admin' : undefined;
                req.authorization = {
                    user: adminuser ? adminuser : dataToken.user,
                    loggedIn: true,
                }

                return next();
            })

        } catch (error) {
            return res.send({
                error: error.message,
            });
        }
    } else {
        return next();
    }
}

const usuariosValidos = (usuario) => {
    const usuarios = `
    1000,
    5484,
    @adminMaxilana2022@,
    `;
    if (usuarios.includes(usuario)) {
        return true;
    } else {
        return false;
    }
}
const rutasLogger = (ruta) => {
    const xr = `${ruta}***`
    const rutas = `
    /api***
    /api/***
    /api/usuarios/login***
    /api/usuarios/registro***
    /api/usuarios/editarperfil***
    /api/usuarios/changepassword***
    /api/pagos/3dsecure/app/producto/v1***
    /api/pagos/3dsecure/app/boleta/v1***
    /api/pagos/3dsecure/web/pp/v1***
    /api/pagos/3dsecure/web/vales/v1***
    /api/pagos/3dsecure/web/boleta/v1***
    /api/pagos/3dsecure/web/productos/v1***
    /api/pagos/3dsecure/rechazos***
    /api/pagos/2dsecure/pruebaguardado***
    /api/pagos/2dsecure/web/boletas***
    /api/pagos/2dsecure/web/producto***
    /api/pagos/2dsecure/vales***
    /api/pagos/2dsecure/pp***
    /api/pagos/2dsecure/producto/v1***
    /api/pagos/2dsecure/boletas/v1***
    /api/pagos/cancelaciones***
    /api/reset***
    /api/reset/***
    `;
    // const rutas = `
    // /api/security/gettoken***
    // `
    if (rutas.includes(xr)) {
        return true;
    } else {
        return false;
    }
}
const rutasRequeridas = (ruta) => {
    const xr = `${ruta}***`
    const rutas = `
    /api***
    /api/***
    /api/pagos/cancelaciones***
    `;
    // const rutas = `
    // /api/security/gettoken***
    // `
    if (rutas.includes(xr)) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    SecureEntry,
    Logger,
}