var request = require('request');
fs = require('fs');
const errorlog = require('../../node_modules/errorlog');
let send = async function consulta(celular,mensaje){
    var datetime = new Date();
    return new Promise(function(resolve,reject){
    let arraynumber = [celular]
var options = {
  'method': 'POST',
  'url': 'https://api.broadcastermobile.com/brdcstr-endpoint-web/services/messaging/',
  'headers': {
    'Content-Type': 'application/json',
    'Authorization': '8DEi6aCm1ig/2yfx/pyjhC0ecWE='
  },
  body: JSON.stringify({
    "apiKey": 7057,
    "country": "MX",
    "dial": 26262,
    "message": mensaje,
    "msisdns": arraynumber
  })
}
request(options, function (error, response) {
  fs.open('log.txt','a', 666, function( e, id ) {
    let err = new Error(error);
    fs.write( id, datetime+err+response.body+"\r\n", null, 'utf8', function(){
      resolve(response)
    });
   });
 
});
}
    )}
let sendInfoCentral = async function consulta(celular,mensaje){

    var url = 'api/GrabarSMS/Celular/'+celular+'/Mensaje/'+mensaje;

    return new Promise(function(resolve,reject){
      request('http://grupoalvarez.com.mx:8089/maxilanaApp/'+encodeURI(url), function (error, response, body) {
            resolve(response);

      });
    });

}
let sendsmspp = async function consulta(celular,mensaje){
  var datetime = new Date();
  return new Promise(function(resolve,reject){
  let arraynumber = [celular]
  var optionspp = {
    'method': 'POST',
    'url': 'https://api.broadcastermobile.com/brdcstr-endpoint-web/services/messaging/',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': '4lhPVINJBDL/jH9pC8SKoc7geu0='
    },
    body: JSON.stringify({
      "apiKey": 11179,
      "country": "MX",
      "dial": 41414,
      "message": mensaje,
      "msisdns": arraynumber,
      "tag":"tag-prueba"
    })
  }



request(optionspp, function (error, response) {
fs.open('log.txt','a', 666, function( e, id ) {
  let err = new Error(error);
  fs.write( id, datetime+err+response.body+"\r\n", null, 'utf8', function(){
    resolve(response)
  });
 });

});
}
)

}
module.exports={
    send,
    sendInfoCentral,
    sendsmspp
}