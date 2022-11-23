const mysql = require('mysql');
const { configMaxilanaDB } = require("../../db/config.js")

let Consultar = async function consultar() {
    return new Promise(function (resolve, reject) {
        const cnn = mysql.createConnection(configMaxilanaDB);
        cnn.connect((errorconnection) => {
            if (errorconnection) return reject(errorconnection)
            let query = 'SELECT * FROM ciudades where activo=1';
            cnn.query(query,  function (errorquery, results, fields) {
                cnn.end(async(errend) => {
                    if (errorquery) { return reject(errorquery) }
                    const Resultado = await JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                })
            });
        })
    });
}
module.exports = {
    Consultar
}
