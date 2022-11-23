const jwt = require('jsonwebtoken');
const jwtConf = require('../config/general');

const SecureEntry = (req, res, next) =>{
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
                    return res.status(401).send({ error: 'El token de autorización ha expirado.' 
                })};

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
const rutasRequeridas = (ruta) => {
    const xr = `${ruta}***`
    const rutas = `
    /api/pagos/2dsecure/vales***
    /api/pagos/2dsecure/web/producto***
    /api/pagos/cancelaciones***
    `;
    if (rutas.includes(xr)) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    SecureEntry
}