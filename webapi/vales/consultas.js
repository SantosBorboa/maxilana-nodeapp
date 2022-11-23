const con = require("../../db/conexion");
const querystring = require('../../node_modules/querystring');
const soap = require("../../node_modules/soap");
let consultarlineadecredito = async function consultar(codigo,contrasena){
    return new Promise(function(resolve,rejec){
        var url= "http://intranet.maxilana.com/wsprestamos/serviciosprestamos.asmx?WSDL"
        const args = {
            strCodigoDistribuidor : codigo,
            strContrasena : contrasena,
            dblMontoACobrar : 0,
            strNombreDistribuidor : '',
            strQuincena : '',
            strMensaje : ''};
        soap.createClient(url, function(err, client) {
            if (err) console.error(err);
            else {
              client.PagosEnLineaValesConsultaDeAbonos2(args, function(err, response) {
                if (err) console.error(err);
                else {
                    result = JSON.parse(JSON.stringify(response));
                    resolve(result);
                }
              });
            }
          });
    });
}
module.exports={
    consultarlineadecredito
}