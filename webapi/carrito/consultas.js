const con = require("../../db/conexion");
let Resultado = [];
let Altacarrito = async function consultar(items){
    let consulta=' SELECT orden FROM carrito order by orden desc limit 1;';
    return new Promise(function(resolve,reject){
        let query = consulta;
            con.connection.query(query, function (error, results, fields) {
                console.log(results)
                    Resultado = JSON.parse(JSON.stringify(results));
                    if(Resultado.length > 0){
                        var ordnew=parseFloat(Resultado[0]['orden'])
                        ordnew = ordnew + 1;
                    }else{
                        ordnew = 1;
                    }

                    
                    let articulo=[{
                        id:items
                    }]

                    var json = JSON.stringify(articulo)
                    consulta = "INSERT INTO `carrito` (`orden`, `contenido`) VALUES ("+ordnew+","+"'"+json+"')";
                    con.connection.query(consulta, function (error, results, fields) {
                        resolve(ordnew);
                    });
                
          

         });
    });
}
let Obtenercarrito = async function consultar(orden){
    let envio = 0;
    let subtotal = 0;
    let enviototal =0;
    let total = 0;
    var plaza = [];
    let articuloplaza=[];
    let precioseguro=0;
    let envioplaza=350;
    let arrayCar=[];
    let consulta=' SELECT * FROM carrito where orden ='+orden;
    return new Promise(function(resolve,reject){
        let query = consulta;
            con.connection.query(query, function (error, results, fields) {
                if(results && results.length>0){

                let body = JSON.parse(results[0]['contenido']);
                let upcs = '';
     
                for(var i = 0; i < body.length ; i++){
                    upcs = upcs+"'"+body[i]['id']+"'"+",";
                }
                let prodcs=[];
                upcs = upcs.slice(0, -1);
                let selectinicial = 'select r.codigo,r.tipo as idcategoria,t.slug as slugcategoria,t.nombre as nombrecategoria,r.nombre,r.sucursal as idsucursal,s.nombre as nombresucursal,s.slug as slugsucursal, c.id as idciudad,c.nombre as ciudadnombre,c.slug as slugciudad, r.precio,r.precioneto,r.marca,r.observaciones,r.imagen,r.imagen,r.precod,r.ventalinea,cd.costo as descuento from remates r , sucursales s, ciudades c, tipos t, catdescuentosadicionales cd where s.numero = r.sucursal and c.id = s.ciudad and t.id = r.tipo and cd.tipo=r.tipo'
                consulta = selectinicial + " and r.codigo in("+upcs+")";
                con.connection.query(consulta, function (error, results, fields) {
              
                if(results !== undefined){

                    Resultado = JSON.parse(JSON.stringify(results));
                    for(var i=0; i < Resultado.length;i++){
                        if(!plaza.includes(Resultado[i].idciudad)){
                            envio = envio +200;

                            articuloplaza.push({
                                id:Resultado[i].idciudad,
                                nombre:Resultado[i].ciudadnombre,
                                envio:envioplaza,
                            })
                            plaza.push(Resultado[i].idciudad);
                        }
                    }
                    let seguroporplaza = 0;
                    for(var t = 0 ; t < articuloplaza.length ; t++){
                        prodcs=[];
                        for(var x = 0 ; x < Resultado.length;x++){
                            if(parseFloat(Resultado[x].idciudad) == parseFloat(articuloplaza[t].id)){
                                precioseguro=0;
                                myArr=[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                                categoria = parseFloat(Resultado[x].idcategoria);
                                if(myArr.includes(categoria)){
                                    precioseguro=precioseguro + parseFloat(Resultado[x].precioneto)*(1.5/100);
                                }else{
                                    costovarios = parseFloat(Resultado[x].precioneto);
                                    if(costovarios >= 10000){
                                        precioseguro=precioseguro + parseFloat(Resultado[x].precioneto)*(1.5/100);
                                    }
                                }
                                seguroporplaza = seguroporplaza + precioseguro;
                                console.log(seguroporplaza)
                                let precioa = parseFloat(Resultado[x].precioneto)*((100-parseFloat(Resultado[x].descuento))/100);
                                subtotal = subtotal + precioa;
                                prodcs.push({
                                         id:Resultado[x].codigo,
                                         precio:parseFloat(precioa.toFixed(2)),
                                         nombre:Resultado[x].nombre,
                                         sucursal:Resultado[x].idsucursal,
                                         nombresucursal : Resultado[x].nombresucursal,
                                         seguro:parseFloat(precioseguro.toFixed(2)),
                                         idciudad:Resultado[x].idciudad
                                     });   
                             
                            }
                        envio = articuloplaza[t].envio + seguroporplaza;
                            
                        }
                        seguroporplaza=0;
                        arrayCar.push({
                            plaza:articuloplaza[t].nombre,
                            envio: parseFloat(envio.toFixed(2)),
                            productos:prodcs
                        });
                        enviototal = enviototal + envio;
                    }
                    let ttl = enviototal + subtotal;
                    let respuesta = {
                        orden :orden,
                        carrito : arrayCar,
                        pago :  {
                            envio : parseFloat(enviototal.toFixed(2)),
                            subtotal:parseFloat(subtotal.toFixed(2)),
                            total :parseFloat(ttl.toFixed(2))
                        }
                    }
                    resolve(respuesta);

                }else{
                    let arr={
                        orden : orden,
                        carrito:[],
                        pago:{
                            envio: envio,
                            subtotal:subtotal,
                            total : subtotal+envio
                        }
                    }
                    resolve(arr);  
                }
         
                });


            }else{
                let arr={
                    orden : null,
                    carrito:[],
                    pago:{
                        envio: envio,
                        subtotal:subtotal,
                        total : subtotal+envio
                    }
                }
                resolve(arr);  
            }
         });
    });
}

let Obtenercarritoventas = async function consultar(orden){
    let envio = 0;
    let subtotal = 0;
    let enviototal =0;
    let total = 0;
    var plaza = [];
    let articuloplaza=[];
    let precioseguro=0;
    let envioplaza=350;
    let arrayCar=[];
    let consulta=' SELECT * FROM carrito where orden ='+orden;
    return new Promise(function(resolve,reject){
        let query = consulta;
            con.connection.query(query, function (error, results, fields) {
                if(results && results.length>0){

                let body = JSON.parse(results[0]['contenido']);
                let upcs = '';
     
                for(var i = 0; i < body.length ; i++){
                    upcs = upcs+"'"+body[i]['id']+"'"+",";
                }
                let prodcs=[];
                upcs = upcs.slice(0, -1);
                let selectinicial = 'select r.codigo,r.tipo as idcategoria,t.slug as slugcategoria,t.nombre as nombrecategoria,r.nombre,r.sucursal as idsucursal,s.nombre as nombresucursal,s.slug as slugsucursal, c.id as idciudad,c.nombre as ciudadnombre,c.slug as slugciudad, r.precio,r.precioneto,r.marca,r.observaciones,r.imagen,r.imagen,r.precod,r.ventalinea,cd.costo as descuento from remates r , sucursales s, ciudades c, tipos t, catdescuentosadicionales cd where s.numero = r.sucursal and c.id = s.ciudad and t.id = r.tipo and cd.tipo=r.tipo'
                consulta = selectinicial + " and r.codigo in("+upcs+")";
                con.connection.query(consulta, function (error, results, fields) {
              
                if(results !== undefined){

                    Resultado = JSON.parse(JSON.stringify(results));
                    for(var i=0; i < Resultado.length;i++){
                        if(!plaza.includes(Resultado[i].idciudad)){
                            envio = envio +200;

                            articuloplaza.push({
                                id:Resultado[i].idciudad,
                                nombre:Resultado[i].ciudadnombre,
                                envio:envioplaza,
                            })
                            plaza.push(Resultado[i].idciudad);
                        }
                    }
                    let seguroporplaza = 0;
                    
                    for(var t = 0 ; t < articuloplaza.length ; t++){
                        prodcs=[];
                        for(var x = 0 ; x < Resultado.length;x++){
                            if(parseFloat(Resultado[x].idciudad) == parseFloat(articuloplaza[t].id)){
                                precioseguro=0;
                                myArr=[1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]
                                categoria = parseFloat(Resultado[x].idcategoria);
                                if(myArr.includes(categoria)){
                                    precioseguro=precioseguro + parseFloat(Resultado[x].precioneto)*(1.5/100);
                                }else{
                                    costovarios = parseFloat(Resultado[x].precioneto);
                                    if(costovarios >= 10000){
                                        precioseguro=precioseguro + parseFloat(Resultado[x].precioneto)*(1.5/100);
                                    }
                                }
                                seguroporplaza = seguroporplaza + precioseguro;
                                let precioa = parseFloat(Resultado[x].precioneto)*((100-parseFloat(Resultado[x].descuento))/100);
                                subtotal = subtotal + precioa;
                                prodcs.push({
                                         id:Resultado[x].codigo,
                                         precio:parseFloat(precioa.toFixed(2)),
                                         nombre:Resultado[x].nombre,
                                         sucursal:Resultado[x].idsucursal,
                                         nombresucursal : Resultado[x].nombresucursal,
                                         seguro:parseFloat(precioseguro.toFixed(2)),
                                         idciudad:Resultado[x].idciudad
                                     });   
                             
                            }
                        envio = articuloplaza[t].envio + seguroporplaza;
                            
                        }
                        seguroporplaza=0;
                        arrayCar.push({
                            plaza:articuloplaza[t].nombre,
                            envio: parseFloat(envio.toFixed(2)),
                            productos:prodcs
                        });
                        enviototal = enviototal + envio;
                    }
                    let ttl = enviototal + subtotal;
                    let respuesta = {
                        orden :orden,
                        carrito : arrayCar,
                        pago :  {
                            envio : parseFloat(enviototal.toFixed(2)),
                            subtotal:parseFloat(subtotal.toFixed(2)),
                            total :parseFloat(ttl.toFixed(2))
                        }
                    }

                    for(var n = 0; n < respuesta.carrito.length;n++){
                        var envioxArticuloPlaza= envioplaza /respuesta.carrito[n].productos.length;
                        let totalPlaza = 0;
                            for(var i = 0; i < respuesta.carrito[n].productos.length;i++){
                                respuesta.carrito[n].productos[i]['envio']= parseFloat(envioxArticuloPlaza.toFixed(2));
                                totalPlaza =parseFloat(totalPlaza)+parseFloat(envioxArticuloPlaza.toFixed(2));
                            }
                           if(totalPlaza > envioplaza){
                               var residuo = parseFloat(totalPlaza-envioplaza);
                               var resta = respuesta.carrito[n].productos[respuesta.carrito[n].productos.length-1]['envio'];
                               var r = resta - residuo.toFixed(2);
                               respuesta.carrito[n].productos[respuesta.carrito[n].productos.length-1]['envio']= parseFloat(r);
                           }
                    }

                    resolve(respuesta);

                }else{
                    let arr={
                        orden : orden,
                        carrito:[],
                        pago:{
                            envio: envio,
                            subtotal:subtotal,
                            total : subtotal+envio
                        }
                    }
                    resolve(arr);  
                }
         
                });


            }else{
                let arr={
                    orden : null,
                    carrito:[],
                    pago:{
                        envio: envio,
                        subtotal:subtotal,
                        total : subtotal+envio
                    }
                }
                resolve(arr);  
            }
         });
    });
}

let Agregarcarrito = async function consultar(orden,codigo){
    let articuloexistente=0;
    let consulta=' SELECT * FROM carrito where orden ='+orden;
    return new Promise(function(resolve,reject){
        let query = consulta;
            con.connection.query(query, function (error, results, fields) {
                let body = JSON.parse(results[0]['contenido']);
                let array=[];
                for(var i = 0; i < body.length;i++){
                    array.push({
                        id:body[i]['id']
                    })
                    if(codigo == body[i]['id']){
                        articuloexistente=1;
                    }

                }
                if(articuloexistente==0){
                    array.push({
                        id:codigo
                    })
                }
                var json = JSON.stringify(array)
    
                consulta = "UPDATE `carrito` SET `contenido`='"+json+"' WHERE orden="+orden;
                con.connection.query(consulta, function (error, results, fields) {
                    resolve(orden);
                });
         });
    });
}

let Borrararticulo = async function consultar(orden,codigo){
    let consulta=' SELECT * FROM carrito where orden ='+orden;
    return new Promise(function(resolve,reject){
        let query = consulta;
            con.connection.query(query, function (error, results, fields) {
                console.log(results)
                let body = JSON.parse(results[0]['contenido']);
                let array=[];
                for(var i = 0; i < body.length;i++){

                    if(codigo !== body[i]['id']){
                        array.push({
                            id:body[i]['id']
                        });
                    }
                }
                var json = JSON.stringify(array)

                consulta = "UPDATE `carrito` SET `contenido`='"+json+"' WHERE orden="+orden;
                con.connection.query(consulta, function (error, results, fields) {
                    resolve(orden);
                });
         });
    });
}

module.exports={
    Altacarrito,
    Obtenercarrito,
    Obtenercarritoventas,
    Borrararticulo,
    Agregarcarrito
}