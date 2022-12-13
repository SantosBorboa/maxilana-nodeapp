const express = require('express')
const Router = express.Router()

Router.get('/api/tests/doo', (req, res, next) => {
    return res.send('doo')
})
Router.get('/api/tests/mee', (req, res, next) => {
    return res.send('mee')
})
Router.post('/api/tests/kk', (req, res, next) => {
    return res.send('kk')
})

module.exports = Router;