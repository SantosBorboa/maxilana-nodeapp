const { Console } = require('console');
const con = require("../db/conexion")
const Not = require("./notificaciones");
const sms = require('../webapi/sms/sendsms');
let cBoletasvencidas = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/Notificaciones/Boletasvencidas";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            Resultado = JSON.parse(response.body);
            Res = Resultado.data.response;
            const Arr = [];

            for(var i = 0; i < Res.length; i++){
                let Bol = Math.floor(Res[i].Boleta);
                Res[i]['Texto']='Estimado Cliente, Maxilana le informa que su boleta '+Bol+' vence el día de hoy, usted puede refrendar o comprar días dando click aquí.'
            }


            Res.forEach(p => {
              if(Arr.findIndex(pd => pd.CodigoUsuario === p.CodigoUsuario) === -1) {
                Arr.push(p);
              }else{
                    let len =Arr.length-1
                    Arr[len].Texto='Estimado Cliente, Maxilana le informa que alguna de sus boletas vence el día de hoy, usted puede refrendar o comprar días dando click aquí.'
              }
            });
            
            for(var j = 0 ; j < Arr.length ; j++){

                let query = 'insert into Notificaciones(Token, CodigoUsuario, Boleta, FechaVenc, Nombre, PrimerApellido, SegundoApellido, Texto) values '+
                '('+"'"+Arr[j].IdToken+"'"+', '+"'"+Arr[j].CodigoUsuario+"'"+', '+"'"+Arr[j].Boleta+"'"+', '+"'"+Arr[j].FecVen+"'"+', '+"'"+Arr[j].Nombre+"'"+', '+"'"+Arr[j].PrimerApellido+"'"+', '+"'"+Arr[j].SegundoApellido+"'"+', '+"'"+Arr[j].Texto+"'"+')';
                con.connection.query(query,function(error,results,fields){
                });

                const data = {
                    tokenId: Arr[j].IdToken,
                    titulo: "Maxilana",
                    mensaje: Arr[j].Texto
                }
                Not.sendPushToOneUser(data)

            }


            resolve(Res);
        });
    });
}
let ObtenerMensajesParaNotificar = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/Notificaciones/sms/Boletasvencidas";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            Resultado = JSON.parse(response.body);
            Res = Resultado.data.response;
            for(var j = 0 ; j < Res.length ; j++){
                sms.send(Res[j].NumeroTelefonico, Res[j].Mensaje);
            }
            resolve(Res);
        });
    });
}

module.exports={
    cBoletasvencidas,
    ObtenerMensajesParaNotificar
}