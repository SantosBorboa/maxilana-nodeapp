const con = require("../../db/conexion");

let Costoenvio = async function consultar(codigo){

    return new Promise(function(resolve,reject){
    let query = 'select a.tipo,r.costo,nombre,marca,r.activo,t.costo as costotipo from remates  as a left join costoenvioporproducto as r on a.codigo = r.codigo inner join cattipoarticulosenvios as t on t.tipo = a.tipo where a.codigo='+"'"+codigo+"'";
        con.connection.query(query, function (error, results, fields) {
            Resultado = JSON.parse(JSON.stringify(results));
       
            var costo = Resultado[0].costo;
            if(costo  !== null){
                Resultado[0].costotipo=costo;
            }

            resolve(Resultado);
         });
    });
}
let Costoenviov1 = async function consultar(codigo){

    return new Promise(function(resolve,reject){
    let query = 'select precioneto,tipo from remates where codigo='+"'"+codigo+"'";
        con.connection.query(query, function (error, results, fields) {
            Resultado = JSON.parse(JSON.stringify(results));
            var precioseguro=0;
            var precioarticulo = parseFloat(Resultado[0].precioneto);
            if(precioarticulo >= 10000){
                precioseguro=precioseguro + parseFloat(Resultado[0].precioneto)*(1.5/100);
            }
            myArr=[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]
            categoria = parseFloat(Resultado[0].tipo);
            if(myArr.includes(categoria)){
                precioseguro=precioseguro + parseFloat(Resultado[0].precioneto)*(1.5/100);
            }else{
                costovarios = parseFloat(Resultado[0].precioneto);
                if(costovarios >= 10000){
                    precioseguro=precioseguro + parseFloat(Resultado[0].precioneto)*(1.5/100);
                }
            }
            let res ={
                envio : 200,
                seguro : precioseguro
            }
            resolve(res);
         });
    });
}
module.exports={
    Costoenvio,
    Costoenviov1
}