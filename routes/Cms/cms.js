const express = require('express');
const Router = express.Router();
const remates = require('../../webapi/remates/consultas.js');
const images = require('../../webapi/images/imagechange.js');

Router.get('/api/datos/cat',(req, res, next)=>{
    remates.getCat().then(respuesta=>{
        return res.send(respuesta);
    }).catch(err=>{return res.send({ error: err.message })})
})
Router.get('/api/image', (req, res) => {
    const { url, w, h, q, blur } = req.query;

    const format = req.headers.accept && req.headers.accept.includes('image/webp') ? 'webp' : 'jpg';
    res.set('Cache-control', 'public, max-age=31536000');
    images.download(decodeURIComponent(url))
        .then((response) =>
            response
                .pipe(
                    images.transform({
                        blur: parseInt(blur),
                        height: parseInt(h),
                        width: parseInt(w),
                        quality: parseInt(q),
                        format,
                    }),
                )
                .pipe(res),
        )
        .catch((err) => {
            res.status(404).send('');
        });

});
module.exports = Router;