const express = require('express');
const Router = express.Router();
const sodium = require('../../webapi/libsodium/libsodium')
const ds = require('../../datastorage/datastore');

Router.post('/api/storage/savedata', async (req, res, next) => {
    const data = req.body.data?req.body.data:undefined;
    if(!data){return res.send({error: 'data inválido'})}
    try {
        const savedData = await ds.SaveStorage(data);
        if(!savedData){return res.send({error: 'No se ha podido guardar los datos.'})}
        return res.send({success:'Datos guardados con éxito.', savedId : savedData});
    } catch (error) {
        return res.send({error: error.message});
    }
});

Router.post('/api/storage/deldata', async (req, res, next) =>{
    const id = req.body.id?req.body.id:undefined;
    if(!id) {return res.send({error: 'Id inválido.'})}
    try {
        const delData = await ds.DeleteStorage(id);
        if(!delData) {return res.send({ error: 'Error al borrar el dato o dato yá borrado con anterioridad.'})}
        return res.send({success:'Datos borrados con éxito.'});
    } catch (error) {
        return res.send({error: error.message});
    }
});
 
Router.post('/api/storage/getdata', async (req, res, next) =>{
    const id = req.body.id?req.body.id:undefined;
    if (!id) { return res.sendStatus(400).send({ error: 'Falta especificar el id.' }) }
    try {
        const data = await ds.GetDataStorage(id);
        if(!data) {return res.send({ error: 'Error al obtener el dato o dato inexistente.'})}
        return res.send({success:'Datos obtenidos con éxito.', data: {id:data.id, data:JSON.parse(data.data)}});
    } catch (error) {
        return res.send({error: error.message});
    }
});


module.exports = Router