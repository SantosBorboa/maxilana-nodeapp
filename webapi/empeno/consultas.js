const { interopDefault } = require("next/dist/server/load-components");
const con = require("../../db/conexion");
const soap = require("../../node_modules/soap");
let obtenerinfoboleta = async function consultar(boleta,letra,prestamo){
    var SelectSucursal ="SELECT HoraAperturaLV,HoraCierreLV,HoraAperturaS,HoraCierreS,HoraAperturaD,HoraCierreD,zonahoraria,now() as HoraActual FROM `sucursales` where identificador='"+letra+"'";
    const d = new Date();
    let dia = d.getDay();
    let BanderaEntrada = true;
    return new Promise(function(resolve,reject){
        con.connection.query(SelectSucursal, function (error, results, fields) {
            if(results != undefined){
                Resultado= JSON.parse(JSON.stringify(results));
                console.log(Resultado[0]);
                let Comparar = [];

                if(dia == 0){
                    Comparar.push(Resultado[0].HoraAperturaD);
                    Comparar.push(Resultado[0].HoraCierreD);
                }
                else{
                    if(dia <= 5){
                        Comparar.push(Resultado[0].HoraAperturaLV);
                        Comparar.push(Resultado[0].HoraCierreLV);
                    }else{
                        Comparar.push(Resultado[0].HoraAperturaS);
                        Comparar.push(Resultado[0].HoraCierreS);
                  }
                }
                var invdate = new Date(d.toLocaleString('en-US', {
                    timeZone: Resultado[0].zonahoraria
                  }));
                var DateLocal =(invdate.getHours()+":"+invdate.getMinutes()+":"+invdate.getSeconds()).toString();
                  
                if(DateLocal >= Comparar[0] && DateLocal <= Comparar[1]){
                    BanderaEntrada = true;
                }else{
                    BanderaEntrada = false;
                }
                if(letra == "CD" || letra == "cd"){
                    BanderaEntrada = false;
                }
                var url= "https://grupoalvarez.com.mx/wsconsultaboleta/serviciosconsultaboleta.asmx?WSDL"
                const args = { strBoleta: boleta, strIdentificador: letra, strImporte:prestamo, flagEntra: BanderaEntrada};
                soap.createClient(url, function(err, client) {
                    if (err) console.error(err);
                    else {
                      client.RegresaBoleta(args, function(err, response) {
                        if (err) console.error(err);
                        else {
                            result = JSON.parse(JSON.stringify(response));
                            resultado = result["RegresaBoletaResult"]["diffgram"];
                            if(resultado == null){
                                let end ={
                                    error : 'La boleta ingresada no existe'
                                }
                                resolve(end);
                            }else{
                                result = result["RegresaBoletaResult"]["diffgram"]["NewDataSet"]["Informacion"];
                                prestamo = parseFloat(prestamo).toFixed(2);
                                prestamoReal = parseFloat(result.Prestamo).toFixed(2);
                                if(prestamo == prestamoReal){
                                    let objCom = {
                                        comision:'1.03'
                                    }
                                    Object.assign(result, objCom);
                                    resolve(result);
                                }
                               else{
                                   let error={
                                       error : "La información ingresada no es correcta."
                                   }
                                   resolve(error);
                               }
                            }
                          
                        }
                      });
                    }
                  });  
            }
         });
    });
}
let obtenerinfoboletaWSP = async function consultar(boleta,letra,prestamo){
    var SelectSucursal ="SELECT HoraAperturaLV,HoraCierreLV,HoraAperturaS,HoraCierreS,HoraAperturaD,HoraCierreD,zonahoraria,now() as HoraActual FROM `sucursales` where identificador='"+letra+"'";
    const d = new Date();
    let dia = d.getDay();
    let BanderaEntrada = true;
    return new Promise(function(resolve,reject){
        con.connection.query(SelectSucursal, function (error, results, fields) {
            if(results != undefined){
                Resultado= JSON.parse(JSON.stringify(results));
                console.log(Resultado[0]);
                let Comparar = [];

                if(dia == 0){
                    Comparar.push(Resultado[0].HoraAperturaD);
                    Comparar.push(Resultado[0].HoraCierreD);
                }
                else{
                    if(dia <= 5){
                        Comparar.push(Resultado[0].HoraAperturaLV);
                        Comparar.push(Resultado[0].HoraCierreLV);
                    }else{
                        Comparar.push(Resultado[0].HoraAperturaS);
                        Comparar.push(Resultado[0].HoraCierreS);
                  }
                }
                var invdate = new Date(d.toLocaleString('en-US', {
                    timeZone: Resultado[0].zonahoraria
                  }));
                var DateLocal =(invdate.getHours()+":"+invdate.getMinutes()+":"+invdate.getSeconds()).toString();
                  
                if(DateLocal >= Comparar[0] && DateLocal <= Comparar[1]){
                    BanderaEntrada = true;
                }else{
                    BanderaEntrada = false;
                }
                var url= "https://grupoalvarez.com.mx/wsconsultaboleta/serviciosconsultaboleta.asmx?WSDL"
                const args = { strBoleta: boleta, strIdentificador: letra, strImporte:prestamo, flagEntra: BanderaEntrada};
                soap.createClient(url, function(err, client) {
                    if (err) console.error(err);
                    else {
                      client.RegresaBoleta(args, function(err, response) {
                        if (err) console.error(err);
                        else {
                            result = JSON.parse(JSON.stringify(response));
                            resultado = result["RegresaBoletaResult"]["diffgram"];
                            if(resultado == null){
                                let end ={
                                    error : 'La boleta ingresada no existe'
                                }
                                resolve(end);
                            }else{
                                result = result["RegresaBoletaResult"]["diffgram"]["NewDataSet"]["Informacion"];
                                const months = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                                var date = new Date();
                                const formatDate = (date)=>{
                                let formatted_date = date.getDate() + " de " + months[date.getMonth()] + " del " + date.getFullYear()
                                return formatted_date;
                                }
                                prestamo = parseFloat(prestamo).toFixed(2);
                                prestamoReal = parseFloat(result.Prestamo).toFixed(2);
                                if(prestamo == prestamoReal){
                                    let Res = {
                                        Cliente : result.Cliente,
                                        Boleta : result.BoletaActual,
                                        Fechavencimiento: formatDate(date),
                                        Prestamo : parseFloat(result.Prestamo).toFixed(2),
                                        Estatus : result.EstadoBoleta,
                                        Refrendo : "1,305.80"
                                    }
                                    resolve(Res);
                                }
                               else{
                                   let error={
                                       error : "La información ingresada no es correcta."
                                   }
                                   resolve(error);
                               }
                            }
                          
                        }
                      });
                    }
                  });  
            }
         });
    });
}
let avaluodeauto = async function consultar(ciudad,marca,modelo,tipo,cantidad,correo,telefono,nombre,primerapellido,segundoapellido,fechanacimiento){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx/wsBusquedaArticulos/ServiciosBusquedaArticulos.asmx?WSDL"
        const args = { 
            strCiudad: ciudad, 
            strMarca: marca, 
            strModelo:modelo,
            strTipo:tipo,
            strCantidad:cantidad,
            strCorreoElectronico:correo,
            strTelefono:telefono,
            strNombre:nombre,
            strPrimerApellido:primerapellido,
            strSegundoApellido:segundoapellido,
            strFechaNacimiento:fechanacimiento
        };
        soap.createClient(url, function(err, client) {
            if (err) console.error(err);
            else {
              client.GrabarSolicitudDeAvaluoDeAuto(args, function(err, response) {
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
let calculadoraempeno = async function consultar(plaza,correo,valorprenda,codigoarticulo, codigokilataje, gramos){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/PlazasWeb/PlazasWeb?CodigoPlaza="+plaza+"&CodigoArticulo="+codigoarticulo+"&ValorPrenda="+valorprenda+"&CorreoElectronico="+correo + "&CodigoKilataje=" + codigokilataje + "&Gramos=" + gramos;
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
           let x = JSON.parse(response.body);
           console.log(x);
           let plazos = x.PlazoMaximo;
           let tasainteresnormal = x.TasaInteresMensual;
           let tasainteresoro = x.TasaInteresOro;
           let tasainteresplata = x.TasaInteresPlata;
           let tasainteresbronze = x.TasaInteresBronce;
           let prestamoro = x.TasaPrestamoOro;
           let prestamplata = x.TasaPrestamoPlata;
           let prestamobronce = x.TasaPrestamoBronce;
           let prestamonormal = x.TasaPrestamoMensual;
           let Prestamo= x.Prestamo;
           let TasaPlazo = x.TasaPlazo;     
            let TasasPorPlazo = {};
           
          for(var i =0; i < plazos; i++){
            var result = {};
            var Pres = Prestamo;
            let taza = (1+TasaPlazo[i].Tasa);
            let tazaplazo =(TasaPlazo[i].Plazo)

            let presbron = (parseFloat(Prestamo) * parseFloat(1+prestamobronce))*taza;
            let presplat = (parseFloat(Prestamo) *  parseFloat(1+prestamplata))*taza;
            let presoro  = (parseFloat(Prestamo) *  parseFloat(1+prestamoro))*taza;
            let presnormal = (parseFloat(Prestamo) *  parseFloat(1+prestamonormal))*taza;

            let tsainormal = (parseFloat(Prestamo) *  parseFloat(tasainteresnormal))*tazaplazo;
            let tsaibronce =  (parseFloat(Prestamo) *  parseFloat(tasainteresbronze))*tazaplazo;
            let tsaiplata =  (parseFloat(Prestamo) *  parseFloat(tasainteresplata))*tazaplazo;
            let tsaioro =  (parseFloat(Prestamo) *  parseFloat(tasainteresoro))*tazaplazo;
            result={
                Prestamonormal : parseInt(presnormal),
                Prestamobronce : parseInt(presbron),
                Prestamoplata : parseInt(presplat),
                Prestamooro :  parseInt(presoro),
                Interesnormal: parseInt(tsainormal),
                Interesbronce : parseInt(tsaibronce),
                Interesplata : parseInt(tsaiplata),
                Interesoro : parseInt(tsaioro)
            }
            TasasPorPlazo[i+1]=result;
          }
          console.log(TasasPorPlazo);
          resolve(TasasPorPlazo);
        });
    });
}
let calculadoraempenoplazas = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/Plazas/Plazas";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            var ArrayPlazas = [];
            var Contador = 0;
            Resultado = JSON.parse(response.body);
            for(var i = 0; i < Resultado.Plazas.length ; i++){
                if(Resultado.Plazas[i].Activo == true){
                    ArrayPlazas[Contador] = Resultado.Plazas[i];
                    Contador = Contador+1;
                }
            }
            resolve(ArrayPlazas);
        });
    });
}
let calculadoramarcas = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/PlazasWeb/catMarcas";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            var ArrayPlazas = [];
            var Contador = 0;
            Resultado = JSON.parse(response.body);
            resolve(Resultado);
        });
    });
}
let calculadorakilatajes = async function consultar(){
    return new Promise(function(resolve,reject){
        var url= "https://grupoalvarez.com.mx:4435/api/PlazasWeb/catKilatajes";
        var request = require('request');
        request.get({
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        url:     url,
        }, function(error, response, body){
            var ArrayPlazas = [];
            var Contador = 0;
            Resultado = JSON.parse(response.body);
            resolve(Resultado);
        });
    });
}
let obtenerversionapp = async function consultar(){
    let selectinicial = 'select * from versionappmaxilana'
    return new Promise(function(resolve,reject){
        let query = selectinicial;
        con.connection.query(query, function (error, results, fields) {
            if(results != undefined){
                console.log(results);
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado[0]);
            }else{
                resolve("No hay información para mostrar.")
            }

         });
    });
}
let obtenerpreguntasfrecuentas = async function consultar(){
    let selectinicial = 'select * from preguntasaplicacion'
    return new Promise(function(resolve,reject){
        let query = selectinicial;
        con.connection.query(query, function (error, results, fields) {
            if(results != undefined){
                console.log(results);
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado);
            }else{
                resolve("No hay información para mostrar.")
            }

         });
    });
}
let obtenerpreguntasporid = async function consultar(id){
    let selectinicial = 'select * from preguntasappniveldos where id='+id;
    return new Promise(function(resolve,reject){
        let query = selectinicial;
        con.connection.query(query, function (error, results, fields) {
            if(results != undefined){
                console.log(results);
                Resultado = JSON.parse(JSON.stringify(results));
                resolve(Resultado);
            }else{
                resolve("No hay información para mostrar.")
            }

         });
    });
}
module.exports={
    obtenerinfoboletaWSP,
    obtenerinfoboleta,
    calculadoraempeno,
    obtenerversionapp,
    obtenerpreguntasporid,
    obtenerpreguntasfrecuentas,
    calculadoraempenoplazas,
    avaluodeauto,
    calculadoramarcas,
    calculadorakilatajes
}