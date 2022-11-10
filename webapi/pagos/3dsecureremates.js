const con = require("../../db/conexion");
const libsodium = require("../libsodium/libsodium.js");
var uniqid = require("uuid");
const env = require('../../node_modules/dotenv').config({ path: '../../.env' });
let Obtenerid = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,Monto,Sucursal,upc,cardtype){

    return new Promise(function(resolve,reject){

        let id = uniqid.v4();
        id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
        id = id.toString().substr(0,15);
        let query = 'insert into informacionTransaccionVentas(id, tarjeta, vencimiento, ccv2, nombre, monto, codigosucursal, upc, fecha) values '+
                    '('+"'"+id+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+Monto+"'"+', '+"'"+Sucursal+"'"+', '+"'"+upc+"'"+', now())';
                    con.connection.query(query, function (error, results, fields) {
        resolve(id);
       });
    });
}
let Obteneridv2 = async function consultar(Tarjeta ,Vencimiento ,Ccv ,TarjetaHabiente ,Monto ,Sucursal ,upc ,phone , typecard, street, country , state , city, postalcode){

    return new Promise(function(resolve,reject){
        console.log(phone)
        let id = uniqid.v4();
        id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
        id = id.toString().substr(0,15);
        let query = 'insert into informacionTransaccionVentas(idPrincipal, id, tarjeta, vencimiento, ccv2, nombre, monto, codigosucursal, upc, fecha, celular, typecard, street, country, state, city, postalcode) values '+
                    '('+"'"+id+"','"+id+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+Monto+"'"+', '+"'"+Sucursal+"'"+', '+"'"+upc+"'"+', now(),'+"'"+phone+"',"+"'"+typecard+"','"+street+"','"+country+"',"+"'"+state+"',"+"'"+city+"','"+postalcode+"')";
                    console.log(query)
        con.connection.query(query, function (error, results, fields) {
        resolve(id);
       });
    });
}
let Datosdeenvio = async function datos(id,nombre,celular,correo,direccion,cp,colonia,municipio,estado,instrucciones,total,numorden){
    return new Promise(function(resolve,reject){
        let query = 'insert into informacionEnvioArticulos(id, nombre, celular, correoelectronico, direccion, codigopostal, colonia, municipio, estado, fecha, instrucciones) values '+
                    '('+"'"+id+"'"+', '+"'"+nombre+"'"+', '+"'"+celular+"'"+', '+"'"+correo+"'"+', '+"'"+direccion+"'"+', '+"'"+cp+"'"+', '+"'"+colonia+"'"+', '+"'"+municipio+"'"+','+"'"+estado+"'"+', now(),'+"'"+instrucciones+"')";
            con.connection.query(query,function(error,results,fields){
                var array=({
                    id : id,
                    merchancity : env.parsed.merchant_city,
                    merchanname : env.parsed.merchant_name,
                    merchanid : env.parsed.merchant_id,
                    correoEmpresa :env.parsed.correoelectronicousuario,
                    correoserv : env.parsed.correoelectronicoservidor,
                    correopass : env.parsed.correoelectronicocontrasena,
                    total: total,
                    orden : numorden
                });
                resolve(array);
            });
    });
}

let Obteneridmultiplev2 = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,detalledepago, phone , typecard, street, country , state , city, postalcode){
    return new Promise(function(resolve,reject){
    let id = uniqid.v4();
    id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
    id = id.toString().substr(0,15);
    let contenido = detalledepago.carrito

    for(var i = 0 ; i < contenido.length ; i++){
        console.log(contenido[i]);
        let car =contenido[i].productos;
        for(var j = 0;j< car.length ; j++){
         console.log(car[j])
        let idDetalle = uniqid.v4();
        idDetalle= idDetalle.toString().replace(/[^a-zA-Z0-9]/g, '');
        idDetalle = idDetalle.toString().substr(0,15);
        let query = 'insert into informacionTransaccionVentas(idPrincipal,id, tarjeta, vencimiento, ccv2, nombre, monto, codigosucursal, upc, fecha, celular, typecard, street, country, state, city, postalcode) values '+
        '('+"'"+id+"'"+', '+"'"+idDetalle+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+car[j].precio+"'"+', '+"'"+car[j].sucursal+"'"+', '+"'"+car[j].id+"'"+', now(),'+"'"+phone+"',"+"'"+typecard+"','"+street+"','"+country+"',"+"'"+state+"',"+"'"+city+"','"+postalcode+"')";

        con.connection.query(query, function (error, results, fields) {
            console.log(results);
         });
        
        }
    }
    resolve(id);
    });
}

let Obteneridmultiple = async function consultar(Tarjeta,Vencimiento,Ccv,TarjetaHabiente,detalledepago){
    return new Promise(function(resolve,reject){
    let id = uniqid.v4();
    id= id.toString().replace(/[^a-zA-Z0-9]/g, '');
    id = id.toString().substr(0,15);
    let contenido = detalledepago.carrito

    for(var i = 0 ; i < contenido.length ; i++){
        console.log(contenido[i]);
        let car =contenido[i].productos;
        for(var j = 0;j< car.length ; j++){
         console.log(car[j])
        let idDetalle = uniqid.v4();
        idDetalle= idDetalle.toString().replace(/[^a-zA-Z0-9]/g, '');
        idDetalle = idDetalle.toString().substr(0,15);
        let query = 'insert into informacionTransaccionVentas(idPrincipal,id, tarjeta, vencimiento, ccv2, nombre, monto, codigosucursal, upc, fecha) values '+
        '('+"'"+id+"'"+', '+"'"+idDetalle+"'"+', '+"'"+Tarjeta+"'"+', '+"'"+Vencimiento+"'"+', '+"'"+Ccv+"'"+', '+"'"+TarjetaHabiente+"'"+', '+"'"+car[j].precio+"'"+', '+"'"+car[j].sucursal+"'"+', '+"'"+car[j].id+"'"+', now())';

        con.connection.query(query, function (error, results, fields) {
            console.log(results);
         });
        
        }
    }
    resolve(id);
    });
}

let informacion3dsecure = async function datos(reference){
    return new Promise(function(resolve,reject){
        let query = 'SELECT * FROM informacion3dsecure where reference='+"'"+reference+"'";
            con.connection.query(query,function(error,results,fields){
                if(results){
                    Resultado = JSON.parse(JSON.stringify(results));
                    resolve(Resultado)
                }
                else{
                    console.log(query);
                    resolve([]);
                }
            });
    });
}
module.exports={
    Obtenerid,
    Obteneridmultiple,
    Datosdeenvio,
    informacion3dsecure,
    Obteneridv2,
    Obteneridmultiplev2
}
