const { Date } = require('mssql');
const con = require('../db/conexion');
const libsodium = require('../webapi/libsodium/libsodium');
const {keyby} = require('../utils/array');


let ejecutarprocesodepagos = async function consulta(){
    console.log("ENTRO ejecutarprocesodepagos");
    return new Promise(function(resolve,reject){
        
        var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/pagospendientes";
        const request = require('request');
        request(url, function (error, response, body) {
            ResultadoSQL = JSON.parse(response.body);
            query ="SELECT r.id,r.reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,r.tarjeta,r.correoelectronico,r.monto,r.codigosucursal,r.boleta,enviado,DATE_FORMAT(r.fecha,'%Y-%m-%d %T.%f') as fecha,p.diaspagados,p.codigotipopago,o.pagoapp FROM `respuestaspw2` r left join informacionpw2 p on p.id = r.control_number inner join informacion3dsecure o on o.reference=p.idPrincipal where r.id > 15560 and payw_result='A' and text='Aprobado' order by r.id asc"
            con.connection.query(query, function (error, results, fields) {
                if(error){reject(error)}
                if(results != undefined){
                ResultadoMYSQL = JSON.parse(JSON.stringify(results));
                let arr = ResultadoSQL.data.response;

                let arrcontrolSQL = arr.map((el)=>{ return el.control_number },[]);
                let arrcontrolMYSQL = ResultadoMYSQL.map((el)=>{return el.control_number},[]);

                const diferences = diferenciaDeArreglos(arrcontrolMYSQL,arrcontrolSQL);
                const keybyControlNumber = keyby(ResultadoMYSQL, 'control_number');
                const datosdeenvio = diferences.map((dif)=>{
                    const dato = keybyControlNumber[dif]
                    if(dato) return { ...dato, fecha: dato.fecha.substring(0, dato.fecha.length - 3) }
                },[])

                let faro = 0;
                for(var i = 0; i < datosdeenvio.length ; i++){
                    reference = datosdeenvio[i].reference ? datosdeenvio[i].reference : null;
                    control_number =  datosdeenvio[i].control_number ?  datosdeenvio[i].control_number : null;
                    cust_req_date =  datosdeenvio[i].cust_req_date ?  datosdeenvio[i].cust_req_date : null;
                    auth_req_date=  datosdeenvio[i].auth_req_date ?  datosdeenvio[i].auth_req_date : null;
                    auth_rsp_date=  datosdeenvio[i].auth_rsp_date ?  datosdeenvio[i].auth_rsp_date : null;
                    cust_rsp_date=  datosdeenvio[i].cust_rsp_date ?  datosdeenvio[i].cust_rsp_date : null;
                    payw_result=  datosdeenvio[i].payw_result ? datosdeenvio[i].payw_result : null;
                    auth_result=  datosdeenvio[i].auth_result ?  datosdeenvio[i].auth_result : null;
                    payw_code=  datosdeenvio[i].payw_code ?  datosdeenvio[i].payw_code : null;
                    auth_code=  datosdeenvio[i].auth_code ?  datosdeenvio[i].auth_code : null;
                    text=  datosdeenvio[i].text ?  datosdeenvio[i].text : null;
                    card_holder=  datosdeenvio[i].card_holder ?  datosdeenvio[i].card_holder : null;
                    ussuing_bank=  datosdeenvio[i].ussuing_bank ?  datosdeenvio[i].ussuing_bank : null;
                    card_brand=  datosdeenvio[i].card_brand ?  datosdeenvio[i].card_brand : null;
                    card_type=  datosdeenvio[i].card_type ?  datosdeenvio[i].card_type : null;
                    tarjeta=  datosdeenvio[i].tarjeta ?  datosdeenvio[i].tarjeta : null;
                    correoelectronico=  datosdeenvio[i].correoelectronico ?  datosdeenvio[i].correoelectronico : null;
                    monto=  datosdeenvio[i].monto ?  datosdeenvio[i].monto : null; 
                    codigosucursal=  datosdeenvio[i].codigosucursal ?  datosdeenvio[i].codigosucursal : null;
                    boleta=  datosdeenvio[i].boleta ?  datosdeenvio[i].boleta : null;
                    fechaConsulta=  datosdeenvio[i].fecha ?  datosdeenvio[i].fecha : null;
                    dias=  datosdeenvio[i].diaspagados ?  datosdeenvio[i].diaspagados : "0";
                    codigotipopago=  datosdeenvio[i].codigotipopago ?  datosdeenvio[i].codigotipopago : "1";
                    pagoapp = datosdeenvio[i].pagoapp ? datosdeenvio[i].pagoapp : "0";
                    console.log(datosdeenvio)
                        var url="api/grabarpagoboleta/reference/"+reference+"/control_number/"+control_number+"/cust_req_date/"+cust_req_date+"/auth_req_date/"+auth_req_date+"/auth_rsp_date/"+auth_rsp_date+"/cust_rsp_date/"+cust_rsp_date+"/payw_result/"+payw_result+"/auth_result/"+auth_result+"/payw_code/"+payw_code+"/auth_code/"+auth_code+"/text/"+text+"/card_holder/"+card_holder+"/ussuing_bank/"+ussuing_bank+"/card_brand/"+card_brand+"/card_type/"+card_type+"/tarjeta/"+tarjeta+"/correoelectronico/"+correoelectronico+"/monto/"+monto+"/codigosucursal/"+codigosucursal+"/boleta/"+boleta+"/correoenviado/0/fechaConsulta/"+fechaConsulta+"/ctpago/"+codigotipopago+"/dias/"+dias+"/esapp/"+pagoapp;
                        request('http://grupoalvarez.com.mx:8089/maxilanaApp/'+url, function (error, response, body) {
                            var response = JSON.parse(body);
                            let aplicarpago ='https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia='+reference+'&CodigoOperacion=1';
                            request.post(aplicarpago,function(error,response,body){console.log(body)});
                        })
                    }
                    resolve(datosdeenvio);
                   
                }
            });
        });

    });

}
let ejecutarprocesodepagospp = async function consulta(){

    return new Promise(function(resolve,reject){
        
        var url= "http://grupoalvarez.com.mx:8089/maxilanaApp/api/pagospendientes/pp";
        var request = require('request');
        request(url, function (error, response, body) {
            ResultadoSQL = JSON.parse(response.body);
            query ="SELECT id FROM `respuestaspp_pw2` order by id asc"
            con.connection.query(query, function (error, results, fields) {
                if(results != undefined){
                ResultadoMYSQL = JSON.parse(JSON.stringify(results));
                let arr = ResultadoSQL.data.response;
                let arrcontrolSQL =[];
                let arrcontrolMYSQL =[];
                let datosdeenvio = [];
                for( var i = 0; i < arr.length ; i++){
                    arrcontrolSQL.push(parseInt(arr[i].id));
                }
                for(var j = 0; j < ResultadoMYSQL.length; j++){
                    arrcontrolMYSQL.push(parseInt(ResultadoMYSQL[j].id))
                }

                let diferences = diferenciaDeArreglos(arrcontrolMYSQL,arrcontrolSQL);
                for(var j = 0; j < diferences.length; j++){
                    var url= "https://consola.maxilana.com/cronenviainformacionppid.php?id="+diferences[j];
                    var request = require('request');
                    request(url, function (error, response, body) {

                    })
                }
                resolve(diferences);
              }
            });
        });

    });

}
const diferenciaDeArreglos = (arr1, arr2) => {
	return arr1.filter(elemento => arr2.indexOf(elemento) == -1);
}

let ejecutarpagomultipleapp = async function consulta(referencia){

    return new Promise(function(resolve,reject){
        var request = require('request');
            query ="SELECT r.id,r.reference,control_number,cust_req_date,auth_req_date,auth_rsp_date,cust_rsp_date,payw_result,auth_result,payw_code,auth_code,text,card_holder,issuing_bank,card_brand,card_type,r.tarjeta,r.correoelectronico,r.monto,r.codigosucursal,r.boleta,enviado,DATE_FORMAT(r.fecha,'%Y-%m-%d %T.%f') as fecha,p.diaspagados,p.codigotipopago,o.pagoapp FROM `respuestaspw2` r left join informacionpw2 p on p.id = r.control_number inner join informacion3dsecure o on o.reference=p.idPrincipal or o.reference = p.id where r.reference="+referencia;
            console.log(query)
            con.connection.query(query, function (error, results, fields) {
                if(results != undefined){
                ResultadoMYSQL = JSON.parse(JSON.stringify(results));
                let datosdeenvio = ResultadoMYSQL;
                console.log(datosdeenvio)
                for(var i = 0; i < datosdeenvio.length ; i++){
                    console.log("entro la "+ i + " vez");
                    reference = datosdeenvio[i].reference ? datosdeenvio[i].reference : null;
                    control_number =  datosdeenvio[i].control_number ?  datosdeenvio[i].control_number : null;
                    cust_req_date =  datosdeenvio[i].cust_req_date ?  datosdeenvio[i].cust_req_date : null;
                    auth_req_date=  datosdeenvio[i].auth_req_date ?  datosdeenvio[i].auth_req_date : null;
                    auth_rsp_date=  datosdeenvio[i].auth_rsp_date ?  datosdeenvio[i].auth_rsp_date : null;
                    cust_rsp_date=  datosdeenvio[i].cust_rsp_date ?  datosdeenvio[i].cust_rsp_date : null;
                    payw_result=  datosdeenvio[i].payw_result ? datosdeenvio[i].payw_result : null;
                    auth_result=  datosdeenvio[i].auth_result ?  datosdeenvio[i].auth_result : null;
                    payw_code=  datosdeenvio[i].payw_code ?  datosdeenvio[i].payw_code : null;
                    auth_code=  datosdeenvio[i].auth_code ?  datosdeenvio[i].auth_code : null;
                    text=  datosdeenvio[i].text ?  datosdeenvio[i].text : null;
                    card_holder=  datosdeenvio[i].card_holder ?  datosdeenvio[i].card_holder : null;
                    ussuing_bank=  datosdeenvio[i].ussuing_bank ?  datosdeenvio[i].ussuing_bank : null;
                    card_brand=  datosdeenvio[i].card_brand ?  datosdeenvio[i].card_brand : null;
                    card_type=  datosdeenvio[i].card_type ?  datosdeenvio[i].card_type : null;
                    tarjeta=  datosdeenvio[i].tarjeta ?  datosdeenvio[i].tarjeta : null;
                    correoelectronico=  datosdeenvio[i].correoelectronico ?  datosdeenvio[i].correoelectronico : null;
                    monto=  datosdeenvio[i].monto ?  datosdeenvio[i].monto : null; 
                    codigosucursal=  datosdeenvio[i].codigosucursal ?  datosdeenvio[i].codigosucursal : null;
                    boleta=  datosdeenvio[i].boleta ?  datosdeenvio[i].boleta : null;
                    fechaConsulta=  datosdeenvio[i].fecha ?  datosdeenvio[i].fecha : null;
                    date = fechaConsulta.slice(0, 10);
                    dias=  datosdeenvio[i].diaspagados ?  datosdeenvio[i].diaspagados : "0";
                    codigotipopago=  datosdeenvio[i].codigotipopago ?  datosdeenvio[i].codigotipopago : "1";
                    pagoapp = datosdeenvio[i].pagoapp ? datosdeenvio[i].pagoapp : "0";
                        var url="api/grabarpagoboleta/reference/"+reference+"/control_number/"+control_number+"/cust_req_date/"+cust_req_date+"/auth_req_date/"+auth_req_date+"/auth_rsp_date/"+auth_rsp_date+"/cust_rsp_date/"+cust_rsp_date+"/payw_result/"+payw_result+"/auth_result/"+auth_result+"/payw_code/"+payw_code+"/auth_code/"+auth_code+"/text/"+text+"/card_holder/"+card_holder+"/ussuing_bank/"+ussuing_bank+"/card_brand/"+card_brand+"/card_type/"+card_type+"/tarjeta/"+tarjeta+"/correoelectronico/"+correoelectronico+"/monto/"+monto+"/codigosucursal/"+codigosucursal+"/boleta/"+boleta+"/correoenviado/0/fechaConsulta/"+date+"/ctpago/"+codigotipopago+"/dias/"+dias+"/esapp/"+pagoapp;
                        request('http://grupoalvarez.com.mx:8089/maxilanaApp/'+url, function (error, response, body) {
                            console.log(response.body);
                            // let aplicarpago ='https://grupoalvarez.com.mx:4435/api/PagoEnLinea/AplicarPagoWeb?FolioAutorizacion=1&Referencia='+reference+'&CodigoOperacion=1';
                            // request.post(aplicarpago,function(error,response,body){console.log(body)});
                        })
                    }
                    resolve(datosdeenvio);
                   
                }
            });

    });

}
module.exports={
    ejecutarprocesodepagos,
    ejecutarprocesodepagospp,
    ejecutarpagomultipleapp
}
