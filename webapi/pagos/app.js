//const statusMonitor = require('express-status-monitor');
const express = require('express');
const images = require('./webapi/images/imagechange');
const libsodium = require('./webapi/libsodium/libsodium.js');
const remates = require('./webapi/remates/consultas.js');
const envios = require('./webapi/remates/costoenvio');
const sucursales = require('./webapi/sucursales/consultas.js');
const plazas = require('./webapi/plazas/consultas.js');
const users = require('./webapi/usuarios/usuarios');
const listEndpoints = require('express-list-endpoints')
const secure = require('./webapi/pagos/3dsecureremates.js');
const pw2remates = require('./webapi/pagos/pw2remates.js');
const sendinfo = require('./webapi/pagos/sendinfoacentral');
const sendContactocliente = require('./webapi/emails/sendemailcontactocliente');
const email = require('./webapi/emails/sendemailremate');
const emailempeno = require('./webapi/emails/sendemailempeno');
const emailavaluo = require('./webapi/emails/sendemailavaluoautos');
const secureboleta = require('./webapi/pagos/3dsecureempeno');
const secureppyvales = require('./webapi/pagos/3dsecurepagos')
const prestamos = require('./webapi/prestamos/consultas');
const pw2empeno = require('./webapi/pagos/pw2empeno');
const pw2valesyprestamos = require('./webapi/pagos/pw2prestamosvales');
const vales = require('./webapi/vales/consultas');
const empeno = require('./webapi/empeno/consultas');
const contacto = require('./webapi/serviciosadicionales/contacto');
const sms = require('./webapi/sms/sendsms');



//carrito 

const carrito = require('./webapi/carrito/consultas');

//end carrito

const procesos = require('./procesos/pagos');
const cors=require("cors");


let multer = require('multer');
var uniqid = require("uuid");
let upload = multer();
const fs = require('fs');

const PORT = process.env.PORT || 3050;
const app = express();

app.use(express.json());
app.use(cors())
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.setTimeout(0)
    next();
    });
    




//******ROUTES*******//
//REMATES
app.get('/api/productos',(req,res)=>{
    let categoria= req.query.categoria ? req.query.categoria : undefined;
    let query = req.query.q ? req.query.q : undefined;
    let sucursal = req.query.sucursal ? req.query.sucursal : undefined;
    let ciudades = req.query.ciudad ? req.query.ciudad : undefined;

    let categoria_or= req.query._categoria ? req.query._categoria : undefined;
    let query_or = req.query._q ? req.query._q : undefined;
    let sucursal_or = req.query._sucursal ? req.query._sucursal : undefined;
    let ciudades_or = req.query._ciudad ? req.query._ciudad : undefined;

    let vtalinea = req.query.vtalinea ? req.query.vtalinea  : undefined;

    let codigo = req.query.codigo ? req.query.codigo : undefined;
    let orden = req.query.orden ? req.query.orden : undefined;
    let min = req.query.min ? req.query.min : undefined;
    let max = req.query.max ? req.query.max : undefined;

    let page = req.query.page ? req.query.page : 1;
    let limits = req.query.limit ? req.query.limit : 24;
    remates.Obtenertodo(
        categoria,
        query,
        sucursal,
        ciudades,
        categoria_or,
        query_or,
        sucursal_or,
        ciudades_or,
        orden,
        min,
        max,
        vtalinea,
        page,
        limits,
        codigo
    ).then(respuesta=>{
        res.send(respuesta);
    });


 });
 app.get('/api/productos/prueba',(req,res)=>{

    let categoria= req.query.categoria ? req.query.categoria : undefined;
    let query = req.query.q ? req.query.q : undefined;
    let sucursal = req.query.sucursal ? req.query.sucursal : undefined;
    let ciudades = req.query.ciudad ? req.query.ciudad : undefined;

    let categoria_or= req.query._categoria ? req.query._categoria : undefined;
    let query_or = req.query._q ? req.query._q : undefined;
    let sucursal_or = req.query._sucursal ? req.query._sucursal : undefined;
    let ciudades_or = req.query._ciudad ? req.query._ciudad : undefined;

    let vtalinea = req.query.vtalinea ? req.query.vtalinea  : undefined;

    let codigo = req.query.codigo ? req.query.codigo : undefined;
    let orden = req.query.orden ? req.query.orden : undefined;
    let min = req.query.min ? req.query.min : undefined;
    let max = req.query.max ? req.query.max : undefined;

    let page = req.query.page ? req.query.page : 1;
    let limits = req.query.limit ? req.query.limit : 10;
    remates.Obtenertodoprueba(
        categoria,
        query,
        sucursal,
        ciudades,
        categoria_or,
        query_or,
        sucursal_or,
        ciudades_or,
        orden,
        min,
        max,
        vtalinea,
        page,
        limits,
        codigo
    ).then(respuesta=>{
        res.send(respuesta);
    });


 });
//REMATES
 app.get('/api/productos/:idproducto',(req,res)=>{
    const {idproducto}=req.params
    remates.Obtenerarticulosid(idproducto).then(respuesta=>{
     res.send(respuesta);
    })
 });
 app.get('/api/productos/:idproducto/precio',(req,res)=>{
    const {idproducto}=req.params
    remates.Obtenerarticulosidprecio(idproducto).then(respuesta=>{
     res.send(respuesta);
    })
 });


//EMPENO
app.get('/api/boleta',(req,res)=>{
    let Boleta = req.query.boleta;
    let Identificador = req.query.letra;
    let Monto = req.query.monto;
    if(Boleta !== undefined && Identificador !== undefined && Monto !== undefined){
        empeno.obtenerinfoboleta(Boleta,Identificador,Monto).then(respuesta=>{
            res.send(respuesta);
            });
    }else{
        res.send("No hay información para mostrar.");
    }
 });

 app.get('/api/calculadoraempeno/calcularprestamo',(req,res)=>{
    let plaza = req.query.plaza ? req.query.plaza :undefined;
    let correo = req.query.correo ? req.query.correo : undefined;
    let monto = req.query.monto ? req.query.monto : undefined;
    let codigoarticulo = req.query.codigoarticulo ? req.query.codigoarticulo : undefined;
    let codigokilataje = req.query.codigokilataje ? req.query.codigokilataje : undefined;
    let gramos = req.query.gramos ? req.query.gramos : undefined;

    if(plaza !== undefined & correo !== undefined & codigoarticulo !== undefined){

        if(codigoarticulo == "1"){

            if(gramos !== undefined & codigokilataje !== undefined){
                monto = 0;
                empeno.calculadoraempeno(plaza,correo,monto,codigoarticulo, codigokilataje, gramos).then(respuesta=>{
                    console.log(respuesta);
                    res.send(respuesta);
                });
            }else{
                let resp = {
                    respuesta : "Es necesario el campo gramos y codigokilataje"
                }
                res.send(resp);
            }
            
        }else{
            if(monto !== undefined){
                empeno.calculadoraempeno(plaza,correo,monto,codigoarticulo, codigokilataje, gramos).then(respuesta=>{
                    res.send(respuesta);
                });
            }else{
                let resp = {
                    respuesta : "Es necesario el campo monto."
                }
                res.send(resp);
            }
        }

    }else{
        res.send("No hay información para mostrar.");
    }

})
app.get('/api/calculadoraempeno/plazas',(req,res)=>{

        empeno.calculadoraempenoplazas().then(respuesta=>{
            res.send(respuesta);
        });
})
app.get('/api/calculadoraempeno/marcas',(req,res)=>{

    empeno.calculadoramarcas().then(respuesta=>{
        res.send(respuesta);
    });
})
app.get('/api/calculadoraempeno/kilatajes',(req,res)=>{

    empeno.calculadorakilatajes().then(respuesta=>{
        res.send(respuesta);
    });
})
app.post('/api/contacto',upload.array(),(req,res)=>{
    let tema = req.body.tema ? req.body.tema : undefined;
    let nombre = req.body.nombre ? req.body.nombre : undefined;
    let email = req.body.email ? req.body.email : undefined;
    let ciudad = req.body.ciudad ? req.body.ciudad : undefined;
    let asunto= req.body.asunto ? req.body.asunto : undefined;
    let mensaje = req.body.mensaje ? req.body.mensaje : undefined;

    console.log(tema)

    if(tema !== undefined & nombre !== undefined & email !== undefined & ciudad !== undefined & asunto !== undefined & mensaje !== undefined){
        contacto.guardarcontacto(tema,nombre,email,ciudad,asunto,mensaje).then(respuesta=>{
            sendContactocliente.sendemail(tema,nombre,email,ciudad,asunto,mensaje);
            let array ={ Respuesta : true }
            res.send(array);
        });
    }else{
        res.send("Favor de validar los datos de entrada");
    }

})
app.post('/api/avaluodeAuto',upload.array(),(req,res,next)=>{
    ciudad = req.body.ciudad;
    marca = req.body.marca;
    modelo = req.body.modelo;
    tipo = req.body.tipo;
    cantidad = req.body.cantidad;
    correo = req.body.correo;
    telefono = req.body.telefono;
    nombre = req.body.nombre;
    primerapellido = req.body.primerapellido;
    segundoapellido = req.body.segundoapellido;
    fechanacimiento = req.body.fecnac;
    if(ciudad !== undefined & marca !== undefined & modelo !== undefined & tipo !== undefined & cantidad !== undefined & correo !== undefined & telefono !== undefined & nombre !== undefined & primerapellido !== undefined & segundoapellido !== undefined & fechanacimiento !== undefined){
        empeno.avaluodeauto(ciudad,marca,modelo,tipo,cantidad,correo,telefono,nombre,primerapellido,segundoapellido,fechanacimiento).then(respuesta=>{
            let data = respuesta;
            emailavaluo.sendemail(ciudad,marca,modelo,tipo,cantidad,correo,telefono,nombre,primerapellido,segundoapellido,fechanacimiento,'info@maxilana.com');
            emailavaluo.sendemail(ciudad,marca,modelo,tipo,cantidad,'gmendez@maxilana.com',telefono,nombre,primerapellido,segundoapellido,fechanacimiento,correo);
            res.send(data);
        });
    }else{
        res.send("Favor de validar los datos de entrada");
    }
});
//CATEGORIAS 
 app.get('/api/categorias',(req,res)=>{
    const {tipo ,sucursal}=req.params
 
    remates.Obtenertipos(tipo,sucursal).then(respuesta=>{
     res.send(respuesta);
    })
 });
//SUCURSALES
app.get('/api/sucursales',(req,res)=>{
    if(req.query.ciudad == undefined){
        sucursales.Obtenersucursales().then(respuesta=>{
            res.send(respuesta);
           })
    }else{
        sucursales.Obtenersucursalesciudad(req.query.ciudad).then(respuesta=>{
            res.send(respuesta);
           })
    }
    
 });

 app.get('/api/sucursal/:id_slug',(req,res)=>{
    const {id_slug}=req.params
    sucursales.Obtenersucursalporid(id_slug).then(respuesta=>{
     res.send(respuesta);
    })
 });
 //PLAZAS
 app.get('/api/ciudades',(req,res)=>{

    plazas.Consultar().then(respuesta=>{
     res.send(respuesta);
    })
 });

 app.get('/api/obtenercostoenvio/:codigo',(req,res)=>{
    const{codigo}=req.params;
    envios.Costoenvio(codigo).then(respuesta=>{
        res.send(respuesta);
    });
});



//VALES
app.get('/api/servicios/vales/consultarlineadecredito',(req,res)=>{
    let codigodistribuidor = req.query.numdistribuidor;
    let contrasena =   req.query.contrasena
    vales.consultarlineadecredito(codigodistribuidor,contrasena).then(respuesta=>{
        res.send(respuesta);
    });
});
//PRESTAMOS
app.get('/api/servicios/pp/consultarprestamo',upload.array(),(req,res)=>{
    if(req.query.codigoprestamo !== undefined && req.query.prestamo !== undefined){
        let codigoprestamo = req.query.codigoprestamo;
        let sucursal =   codigoprestamo.substr(0,codigoprestamo.indexOf('-'));
        let codigo = codigoprestamo.substr(codigoprestamo.indexOf('-')+1);
        let prestamo = req.query.prestamo;
        prestamos.consultarprestamo(sucursal,codigo,prestamo).then(respuesta=>{
            res.send(respuesta);
        });
    }else{
        let error ={
            error :  "Favor de validar los datos de ingreso"
        }
        res.send(error);
    }

});
app.get('/api/servicios/pp/getplazas',(req,res)=>{
    prestamos.obtenerplazas().then(respuesta=>{
        res.send(respuesta);
    });
});

app.get('/api/servicios/pp/periodicidadespoliticas/:plaza',(req,res)=>{
    const { plaza }=req.params;
    prestamos.periocidadespoliticas(plaza).then(respuesta=>{
        res.setHeader('Content-Type', 'application/json');
        res.send(respuesta);
    });
});

app.get('/api/servicios/pp/getmontoabono/:politica/:monto',(req,res)=>{
    const { politica, monto }=req.params;
    prestamos.getmontoabono(politica, monto).then(respuesta=>{
        res.send(respuesta);
    });
});
app.post('/api/servicios/pp/postgrabarsolicitudcalculadora',upload.array(),(req,res)=>{
    
    var nombre = req.body.Nombre;
    var telefono = req.body.Telefono;
    var correo =req.body.CorreoElectronico;
    var fecha =req.body.Fecha;
    var cplaza =req.body.CodigoPlaza;
    var monto =req.body.MontoSolicitado;
    var cpolitica =req.body.CodigoPolitica;

    if(nombre !== undefined && telefono !== undefined && correo !== undefined && fecha !== undefined && cplaza !== undefined && monto !== undefined && cpolitica !== undefined){
            prestamos.postgrabarsolicitudcalculadora(nombre,telefono,correo,fecha,cplaza,monto,cpolitica).then(respuesta=>{
            res.send(respuesta);
        });
    }
});

//PAGOS
 app.post('/api/procesar3dsecure/producto',upload.array(),(req,res,next)=>{
    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv =req.body.ccv;
    var importe =req.body.importe;
    var titular =req.body.titular;
    var sucursal =req.body.sucursal;
    var upc =req.body.upc;
    var cardtype = req.body.cardtype;

    //DATOS DE ENVIO
    var nombreenvio = req.body.nombreenvio;
    var celular = req.body.celular;
    var correo = req.body.correo;
    var domicilio = req.body.domicilio;
    var codigopostal = req.body.codigopostal;
    var colonia = req.body.colonia;
    var municipio = req.body.municipio;
    var estado = req.body.estado;
    var instrucciones = req.body.instrucciones;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';

    //ENCRIPTAR
  libsodium.encriptar(titular).then(respuesta =>{
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta =>{
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta =>{
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta =>{
                    encrypCcv = respuesta;                   
                    secure.Obtenerid(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,importe,sucursal,upc,cardtype).then(respuesta=>{
                        secure.Datosdeenvio(respuesta,nombreenvio,celular,correo,domicilio,codigopostal,colonia,municipio,estado,instrucciones).then(respuesta=>{
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    });

  //END ENCRIPTAR
 });

 app.post('/api/procesar3dsecure/boletas/v1',upload.array(),(req,res,next)=>{

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv =req.body.ccv;
    var importe =req.body.importe;
    var titular =req.body.titular;
    var sucursal =req.body.sucursal;
    var boleta =req.body.boleta;
    var email = req.body.email;
    var montoboleto = req.body.prestamo;
    var codigotpago = req.body.codigotipopago
    var fConsulta = req.body.fechaconsulta;
    var diasPagados = req.body.diaspagados;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //ENCRIPTAR
  libsodium.encriptar(titular).then(respuesta =>{
 
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta =>{
            console.log(respuesta);
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta =>{
                console.log(respuesta);
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta =>{
                    console.log(respuesta);
                    encrypCcv = respuesta;                   
                    secureboleta.Obteneridboletav1(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,email,importe,sucursal,boleta,montoboleto,codigotpago,fConsulta,diasPagados).then(respuesta=>{
                        res.send(respuesta);
                    });
                });
            });
        });
    });

  //END ENCRIPTAR
 });

 app.post('/api/procesar3dsecure/boletas',upload.array(),(req,res,next)=>{

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv =req.body.ccv;
    var importe =req.body.importe;
    var titular =req.body.titular;
    var sucursal =req.body.sucursal;
    var boleta =req.body.boleta;
    var email = req.body.email;
    var montoboleto = req.body.prestamo;
    var codigotpago = req.body.codigotipopago
    var fConsulta = req.body.fechaconsulta;
    var diasPagados = req.body.diaspagados;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //ENCRIPTAR
  libsodium.encriptar(titular).then(respuesta =>{
 
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta =>{
            console.log(respuesta);
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta =>{
                console.log(respuesta);
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta =>{
                    console.log(respuesta);
                    encrypCcv = respuesta;                   
                    secureboleta.Obteneridboleta(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,email,importe,sucursal,boleta,montoboleto,codigotpago,fConsulta,diasPagados).then(respuesta=>{
                        res.send(respuesta);
                    });
                });
            });
        });
    });

  //END ENCRIPTAR
 });
 app.post('/api/procesar3dsecure/vales',upload.array(),(req,res,next)=>{

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv =req.body.ccv;
    var importe =req.body.importe;
    var titular =req.body.titular;
    var cdistribuidora =req.body.cdistribuidora;
    var email = req.body.correoelectronico;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta =>{
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta =>{
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta =>{
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta =>{
                    encrypCcv = respuesta;                   
                    libsodium.encriptar(email).then(respuesta =>{
                        encrypCorreo = respuesta;                   
                        secureppyvales.Obteneridvales(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,importe,cdistribuidora,encrypCorreo).then(respuesta=>{
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    });

  //END ENCRIPTAR
 });
 app.post('/api/procesar3dsecure/prestamopersonal',upload.array(),(req,res,next)=>{

    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv =req.body.ccv;
    var importe =req.body.importe;
    var titular =req.body.titular;
    var sucursal =req.body.sucursal;
    var codigoprestamo =req.body.codigoprestamo;
    var email = req.body.correoelectronico;

    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    var encrypCorreo = '';
    //ENCRIPTAR
    libsodium.encriptar(titular).then(respuesta =>{

        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta =>{
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta =>{
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta =>{
                    encrypCcv = respuesta;                   
                    libsodium.encriptar(email).then(respuesta =>{
                        encrypCorreo = respuesta;                   
                        secureppyvales.Obteneridprestamos(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,importe,sucursal,codigoprestamo,encrypCorreo).then(respuesta=>{
                            res.send(respuesta);
                        });
                    });
                });
            });
        });
    });

 });
   //END ENCRIPTAR
  app.get('/api/informacion3dsecure/:reference',(req,res)=>{
    const {reference}=req.params
    secure.informacion3dsecure(reference).then(respuesta=>{
     res.send(respuesta);
    })
 });

 app.post('/api/procesar2dsecure/producto',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;
    var costoenvio = req.body.envio;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';
    var precioreal= '';
    var pedido = '';

    pw2remates.Obtenerdatos(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta[0];
        var CorreoPersonal = datainfo.correoparaconfirmaciondecompra+","+datainfo.correosucursal;
        //var CorreoPersonal = "erickogarcia12@gmail.com"
        CorreoPersonal = CorreoPersonal.split(",");
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.ccv2).then(respuesta =>{
                      ccvdecrypt = respuesta;
                        pw2remates.ejecutarventa(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,datainfo.monto,datainfo.codigosucursal,datainfo.upc,datainfo.status,datainfo.eci,datainfo.xid,datainfo.cavv,Reference3D).then(respuesta=>{
                          if(respuesta.resultado_payw == "A"){
                            var data = respuesta;
                            sendinfo.grabardatos(data.referencia,Reference3D,data.fecha_req_cte,data.auth_req_date,data.auth_rsp_date,data.fecha_rsp_cte,data.resultado_payw,data.auth_result,data.payw_code,data.codigo_aut,data.texto,data.card_holder,data.issuing_bank,data.card_brand,data.card_type,tarjetadecrypt,datainfo.correoelectronico,datainfo.monto,datainfo.codigosucursal,datainfo.upc,costoenvio).then(respuesta=>{ 
                                precioreal = (parseFloat(datainfo.monto)-parseFloat(costoenvio));
                                pedido = respuesta.pedido;
                                email.sendemail(respuesta.Pedido,datainfo.nombre,datainfo.celular,datainfo.direccion,datainfo.colonia,datainfo.codigopostal,datainfo.municipio,datainfo.estado,datainfo.instrucciones,datainfo.articulo,datainfo.upc,precioreal,costoenvio,datainfo.monto,CorreoPersonal,datainfo.correoelectronico);
                                var response ={
                                    referencia : Reference3D,
                                    monto : parseFloat(datainfo.monto),
                                    articulo : datainfo.articulo,
                                    contacto : datainfo.celular,
                                    dom : datainfo.direccion+" "+datainfo.colonia+" "+datainfo.codigopostal,
                                    mun : datainfo.municipio,
                                    ciudad : datainfo.estado,
                                    nombreenvio:datainfo.nombre,
                                    envio : costoenvio
                                }
                                res.send(JSON.stringify(response));
                            });
                          }else{
                                  res.send("D");
                          }
                      });
                    });
                });
            });
        });
});
app.post('/api/procesar2dsecure/producto/prueba',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;
    var costoenvio = req.body.envio;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';
    var precioreal= '';
    var pedido = '';

    pw2remates.Obtenerdatos(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta[0];
        console.log(datainfo)
        var CorreoPersonal = datainfo.correoparaconfirmaciondecompra+","+datainfo.correosucursal;
   //     var CorreoPersonal = "erickogarcia12@gmail.com"
        CorreoPersonal = CorreoPersonal.split(",");
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.ccv2).then(respuesta =>{
                      ccvdecrypt = respuesta;
                        pw2remates.ejecutarventaprueba(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,datainfo.monto,datainfo.codigosucursal,datainfo.upc,datainfo.status,datainfo.eci,datainfo.xid,datainfo.cavv,Reference3D).then(respuesta=>{
                          if(respuesta.resultado_payw == "A"){
                            var data = respuesta;
                            sendinfo.grabardatos(data.referencia,Reference3D,data.fecha_req_cte,data.auth_req_date,data.auth_rsp_date,data.fecha_rsp_cte,data.resultado_payw,data.auth_result,data.payw_code,data.codigo_aut,data.texto,data.card_holder,data.issuing_bank,data.card_brand,data.card_type,tarjetadecrypt,datainfo.correoelectronico,datainfo.monto,datainfo.codigosucursal,datainfo.upc,costoenvio).then(respuesta=>{ 
                                precioreal = (parseFloat(datainfo.monto)-parseFloat(costoenvio));
                                pedido = respuesta.pedido;
                                email.sendemail(respuesta.Pedido,datainfo.nombre,datainfo.celular,datainfo.direccion,datainfo.colonia,datainfo.codigopostal,datainfo.municipio,datainfo.estado,datainfo.instrucciones,datainfo.articulo,datainfo.upc,precioreal,costoenvio,datainfo.monto,CorreoPersonal,datainfo.correoelectronico);
                                var response ={
                                    referencia : Reference3D,
                                    monto : parseFloat(datainfo.monto),
                                    articulo : datainfo.articulo,
                                    contacto : datainfo.celular,
                                    dom : datainfo.direccion+" "+datainfo.colonia+" "+datainfo.codigopostal,
                                    mun : datainfo.municipio,
                                    ciudad : datainfo.estado,
                                    nombreenvio:datainfo.nombre,
                                    envio : costoenvio
                                }
                                res.send(JSON.stringify(response));
                            });
                          }else{
                            let error={
                                resultado :"Tarjeta declinada"
                            }
                            res.send(error);
                          }
                      });
                    });
                });
            });
        });
});

app.post('/api/procesar2dsecure/prestamopersonal',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';

    pw2valesyprestamos.Obtenerdatos(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta[0];
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.cvv2).then(respuesta =>{
                      ccvdecrypt = respuesta;

                        pw2valesyprestamos.ejecutarventa(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,datainfo.monto,datainfo.codigosucursal,datainfo.codigoprestamo,datainfo.status,datainfo.eci,datainfo.xid,datainfo.cavv,1).then(respuesta=>{
                            if(respuesta.resultado_payw == "A"){
                                var i = respuesta;
                                sendinfo.grabardatosprestamopersonalyvale(i.referencia,Reference3D,i.fecha_req_cte,i.auth_req_date,i.auth_rsp_date,i.fecha_rsp_cte,i.resultado_payw,i.auth_result,i.payw_code,i.codigo_aut,i.texto,i.card_holder,i.issuing_bank,i.card_brand,i.card_type,tarjetadecrypt,datainfo.correoelectronico,datainfo.monto,datainfo.codigosucursal,datainfo.codigoprestamo,0).then(response=>{
                                    res.send("A")
                                })
                          }else{

                            sendinfo.grabardatosprestamopersonalyvale(i.referencia,Reference3D,i.fecha_req_cte,i.auth_req_date,i.auth_rsp_date,i.fecha_rsp_cte,i.resultado_payw,i.auth_result,i.payw_code,i.codigo_aut,i.texto,i.card_holder,i.issuing_bank,i.card_brand,i.card_type,tarjetadecrypt,datainfo.correoelectronico,datainfo.monto,datainfo.codigosucursal,datainfo.codigoprestamo,0).then(response=>{
                                let error={
                                    resultado :"Tarjeta declinada"
                                }
                                res.send(error);
                            });
                          }
                      });
                    });
                });
            });
        });
});
app.post('/api/procesar2dsecure/boletas',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;
    var Cliente= req.body.Cliente;
    var fechaConsulta= req.body.fechaConsulta;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';
    var boletareference = '';
    pw2empeno.Obtenerdatosboletas(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta[0];
        var CorreoPersonal = datainfo.correoelectronicoparanotificacion;
        CorreoPersonal = CorreoPersonal.split(",");
        boletareference = Math.floor(datainfo.boleta);
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.ccv2).then(respuesta =>{
                      ccvdecrypt = respuesta;
                   pw2empeno.ejecutarcobro(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,datainfo.monto,datainfo.codigosucursal,boletareference,datainfo.status,datainfo.eci,datainfo.xid,datainfo.cavv).then(respuesta=>{
                        if(respuesta.resultado_payw == "A"){
                            var data = respuesta;
                            sendinfo.grabardatosempeno(data.referencia,Reference3D,data.fecha_req_cte,data.auth_req_date,data.auth_rsp_date,data.fecha_rsp_cte,data.resultado_payw,data.auth_result,data.payw_code,data.codigo_aut,data.texto,data.card_holder,data.issuing_bank,data.card_brand,data.card_type,tarjetadecrypt,datainfo.correoelectronico,datainfo.monto,datainfo.codigosucursal,datainfo.boleta,fechaConsulta,datainfo.codigotipopago,datainfo.diaspagados).then(respuesta=>{ 
                                emailempeno.sendemail(Cliente,datainfo.codigosucursal,datainfo.sucnom,datainfo.boleta,datainfo.monto,data.codigo_aut,data.referencia,datainfo.fecha,CorreoPersonal,datainfo.correoelectronico);
                                var response ={
                                    cliente : Reference3D,
                                    sucod : datainfo.codigosucursal,
                                    sucnom : datainfo.sucnom,
                                    boleta : datainfo.boleta,
                                    monto : datainfo.monto,
                                    codaut : data.codigo_aut,
                                    referencia : data.referencia
                                }
                                res.status(200).send(JSON.stringify(response));
                            });
                          }else{
                             res.send("D");
                          }
                      });
                });
                });
            });
        });
});
app.post('/api/procesar3dsecure/web/productos',upload.array(),(req,res,next)=>{
    try{
        var tarjeta = req.body.tarjeta;
        var vencimiento = req.body.vencimiento;
        var ccv =req.body.ccv;
        var titular =req.body.titular;
    
        //DATOS DE ENVIO
        var nombreenvio = req.body.nombreenvio;
        var celular = req.body.celular;
        var correo = req.body.correo;
        var domicilio = req.body.domicilio;
        var codigopostal = req.body.codigopostal;
        var colonia = req.body.colonia;
        var municipio = req.body.municipio;
        var estado = req.body.estado;
        var instrucciones = req.body.instrucciones;
     
        var orden = req.body.orden;
        var encrypTitular = '';
        var encrypTarjeta = '';
        var encrypVencimiento = '';
        var encrypCcv = '';
        libsodium.encriptar(titular).then(respuesta =>{
            encrypTitular = respuesta;
            libsodium.encriptar(tarjeta).then(respuesta =>{
                encrypTarjeta = respuesta;
                libsodium.encriptar(vencimiento).then(respuesta =>{
                    encrypVencimiento = respuesta;
                    libsodium.encriptar(ccv).then(respuesta =>{
                        encrypCcv = respuesta; 
                        carrito.Obtenercarrito(orden).then(respuesta =>{
                        let total = respuesta.pago.total;
                        let numorden = respuesta.orden;
                        secure.Obteneridmultiple(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,respuesta).then(respuesta=>{
                            secure.Datosdeenvio(respuesta,nombreenvio,celular,correo,domicilio,codigopostal,colonia,municipio,estado,instrucciones,total,numorden).then(respuesta=>{
                                res.send(respuesta);
                            });
                        });
                        })

                    });
                });
            });
        });
    }catch(ex){
        res.send(ex);
    }
})

app.post('/api/procesar3dsecure/web/boletas',upload.array(),(req,res,next)=>{
try{
    var tarjeta = req.body.tarjeta;
    var vencimiento = req.body.vencimiento;
    var ccv =req.body.ccv;
    var titular =req.body.titular;
    var email = req.body.email;

 
    var detallepago = req.body.detallepago;
    var encrypTitular = '';
    var encrypTarjeta = '';
    var encrypVencimiento = '';
    var encrypCcv = '';
    libsodium.encriptar(titular).then(respuesta =>{
        encrypTitular = respuesta;
        libsodium.encriptar(tarjeta).then(respuesta =>{
            encrypTarjeta = respuesta;
            libsodium.encriptar(vencimiento).then(respuesta =>{
                encrypVencimiento = respuesta;
                libsodium.encriptar(ccv).then(respuesta =>{
                    encrypCcv = respuesta;                   
                    secureboleta.Obteneridboletamultiple(encrypTarjeta,encrypVencimiento,encrypCcv,encrypTitular,email,detallepago).then(respuesta=>{
                        res.send(respuesta);
                    });
                });
            });
        });
    });
}catch(ex){
    res.send(ex);
}
  //END ENCRIPTAR
 })

 app.post('/api/procesar2dsecure/web/productos',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;
    var total= req.body.total;
    var orden =req.body.orden;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';
    pw2remates.Obtenerdatosmultiple(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta;
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo[0].ccv2).then(respuesta =>{
                      ccvdecrypt = respuesta;
                     pw2remates.ejecutarcobromultiple(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,total,datainfo[0].upc,status,eci,xid,cavv).then(respuesta=>{
                        if(respuesta.resultado_payw == "A"){
                            var data = respuesta;
                            carrito.Obtenercarritoventas(orden).then(respuesta =>{
                            var ResOrden = respuesta;
                            console.log(ResOrden);
                            sendinfo.grabardatosremates(data.referencia,data.fecha_req_cte,data.auth_req_date,data.auth_rsp_date,data.fecha_rsp_cte,data.resultado_payw,data.auth_result,data.payw_code,data.codigo_aut,data.texto,data.card_holder,data.issuing_bank,data.card_brand,data.card_type,tarjetadecrypt,datainfo,1,ResOrden).then(respuesta=>{ 
                            let cliente = datainfo[0].nombre;
                            let domicilio = datainfo[0].direccion;
                            let cp = datainfo[0].codigopostal;
                            let colonia= datainfo[0].colonia;
                            let municipio = datainfo[0].municipio;
                            let estado = datainfo[0].estado;
                            let correoelectronico = datainfo[0].correoelectronico;
                            let correoparaconfirmaciondecompra = datainfo[0].correoparaconfirmaciondecompra;
                            let correosucursal = datainfo[0].correosucursal;
                            var CorreoPersonal = correoparaconfirmaciondecompra+","+correosucursal;
                            //var CorreoPersonal = 'egarcia@maxilana.com'
                            let instrucciones = datainfo[0].instrucciones;
                            let celular = datainfo[0].celular;
    
                              email.sendemailprueba(ResOrden,cliente,celular,domicilio,colonia,cp,municipio,estado,instrucciones,CorreoPersonal,correoelectronico,orden)
                                
                                let resp={
                                    resultado :true,
                                    referencia: data.codigo_aut,
                                    datosenvio:{
                                        nombre : cliente,
                                        celular : celular,
                                        domicilio : domicilio,
                                        colonia: colonia,
                                        codigopostal: cp,
                                        municipio:municipio,
                                        estado: estado,
                                        instrucciones: instrucciones
                                    },
                                    text : respuesta.texto
                                }
                                res.send(JSON.stringify(resp));
              
                                });
                            });
                          }else{
                            let error={
                                resultado :false,
                                text : respuesta.texto
                            }
                            res.send(error);
                          }
                      });

                });
                });
            });
        });
});

app.post('/api/procesar2dsecure/web/boletas',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;
    var Cliente= req.body.Cliente;
    var total= req.body.total;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';
    var boletareference = '';
    pw2empeno.ObtenerdatosboletasPrueba(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta;
        boletareference = Math.floor(datainfo[0].boleta);
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo[0].ccv2).then(respuesta =>{
                      ccvdecrypt = respuesta;
                      pw2empeno.ejecutarcobroprueba(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,total,boletareference,datainfo[0].status,datainfo[0].eci,datainfo[0].xid,datainfo[0].cavv).then(respuesta=>{
                        if(respuesta.resultado_payw == "A"){
                            var data = respuesta;
                            sendinfo.grabardatosempenoprueba(data.referencia,Reference3D,data.fecha_req_cte,data.auth_req_date,data.auth_rsp_date,data.fecha_rsp_cte,data.resultado_payw,data.auth_result,data.payw_code,data.codigo_aut,data.texto,data.card_holder,data.issuing_bank,data.card_brand,data.card_type,tarjetadecrypt,datainfo,1).then(respuesta=>{ 
                                let error={
                                    resultado :true,
                                    text : respuesta.texto
                                }
                                emailempeno.sendemailprueba(Cliente,total,data.codigo_aut,data.referencia,datainfo[0].fecha,datainfo[0].correoelectronico,datainfo[0]);

                                res.send(JSON.stringify(error));
                            });
                          }else{
                            let error={
                                resultado :false,
                                text : respuesta.texto
                            }
                            res.send(error);
                          }
                      });

                });
                });
            });
        });
});

app.post('/api/procesar2dsecure/web/boletas/v1',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;
    var Cliente= req.body.Cliente;
    var total= req.body.total;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';
    var boletareference = '';
    pw2empeno.ObtenerdatosboletasPrueba(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta;
        boletareference = Math.floor(datainfo[0].boleta);
        libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo[0].ccv2).then(respuesta =>{
                      ccvdecrypt = respuesta;
                      pw2empeno.ejecutarcobropruebav1(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,total,boletareference,datainfo[0].status,datainfo[0].eci,datainfo[0].xid,datainfo[0].cavv).then(respuesta=>{
                        if(respuesta.resultado_payw == "A"){
                            var data = respuesta;
                            sendinfo.grabardatosempenoprueba(data.referencia,Reference3D,data.fecha_req_cte,data.auth_req_date,data.auth_rsp_date,data.fecha_rsp_cte,data.resultado_payw,data.auth_result,data.payw_code,data.codigo_aut,data.texto,data.card_holder,data.issuing_bank,data.card_brand,data.card_type,tarjetadecrypt,datainfo,1).then(respuesta=>{ 
                                let error={
                                    resultado :true,
                                    text : respuesta.texto
                                }
                                emailempeno.sendemailmultiple(Cliente,total,data.codigo_aut,data.referencia,datainfo[0].fecha,datainfo[0].correoelectronico,datainfo);

                                res.send(JSON.stringify(error));
                            });
                          }else{
                            let error={
                                resultado :false,
                                text : respuesta.texto
                            }
                            res.send(error);
                          }
                      });

                });
                });
            });
        });
});


// app.post('/api/correo',upload.array(),(req,res,next)=>{
    
//     var Reference3D= req.body.Reference3D;
//     var Cliente= req.body.Cliente;
//     var total= req.body.total;
//     pw2empeno.prueba(Reference3D).then(respuesta=>{
//         var datainfo = respuesta;
//         boletareference = Math.floor(datainfo[0].boleta);
//         libsodium.desencriptar(datainfo[0].tarjeta).then(respuesta =>{
//             tarjetadecrypt = respuesta;
//             libsodium.desencriptar(datainfo[0].vencimiento).then(respuesta =>{
//                 vencimientodecrypt = respuesta;
//                     libsodium.desencriptar(datainfo[0].ccv2).then(respuesta =>{
//                       ccvdecrypt = respuesta;

//                             var data = respuesta;
//                               emailempeno.sendemailprueba(Cliente,total,data.codigo_aut,data.referencia,datainfo[0].fecha,datainfo[0].correoelectronico,datainfo[0]);

//                                 res.send("OK");
//                             });
                          
//                       });

//             });
//           });
// })

app.post('/api/procesar2dsecure/vales',upload.array(),(req,res,next)=>{
    
    var Reference3D= req.body.Reference3D;

    var eci = req.body.eci ? req.body.eci : undefined;
    var xid = req.body.xid ? req.body.xid : undefined;
    var cavv = req.body.cavv ? req.body.cavv : undefined;
    var status = req.body.status ? req.body.status : undefined;
    var cardtype = req.body.cardtype ? req.body.cardtype : undefined;

    var tarjetadecrypt = '';
    var ccvdecrypt='';
    var vencimientodecrypt='';

    pw2valesyprestamos.Obtenerdatos(Reference3D,eci,xid,cavv,status,cardtype).then(respuesta=>{
        var datainfo = respuesta[0];
        libsodium.desencriptar(datainfo.tarjeta).then(respuesta =>{
            tarjetadecrypt = respuesta;
            libsodium.desencriptar(datainfo.vencimiento).then(respuesta =>{
                vencimientodecrypt = respuesta;
                    libsodium.desencriptar(datainfo.cvv2).then(respuesta =>{
                      ccvdecrypt = respuesta;

                        pw2valesyprestamos.ejecutarventa(vencimientodecrypt,ccvdecrypt,tarjetadecrypt,datainfo.monto,datainfo.codigosucursal,datainfo.codigoprestamo,datainfo.status,datainfo.eci,datainfo.xid,datainfo.cavv,1).then(respuesta=>{
                          if(respuesta.resultado_payw == "A"){
                                var i = respuesta;
                                sendinfo.grabardatosprestamopersonalyvale(i.referencia,Reference3D,i.fecha_req_cte,i.auth_req_date,i.auth_rsp_date,i.fecha_rsp_cte,i.resultado_payw,i.auth_result,i.payw_code,i.codigo_aut,i.texto,i.card_holder,i.issuing_bank,i.card_brand,i.card_type,tarjetadecrypt,datainfo.correoelectronico,datainfo.monto,datainfo.codigosucursal,datainfo.codigoprestamo,1).then(response=>{
                                    res.send("A")
                                })
                          }else{
                              res.send("D");
                          }
                      });
                    });
                });
            });
        });
});
app.get('/api/image',(req,res)=>{

        const { url, w, h, q, blur } = req.query;
      
        const format = req.headers.accept && req.headers.accept.includes('image/webp') ? 'webp' : 'jpg';
        res.set('Cache-control', 'public, max-age=31536000');
          images.download(decodeURIComponent(url))
          .then((response) =>
            response
              .pipe(
                images.transform({
                  blur: parseInt(blur),
                  height: parseInt(h),
                  width: parseInt(w),
                  quality: parseInt(q),
                  format,
                }),
              )
              .pipe(res),
          )
          .catch((err) => {
            res.status(404).send('');
          });
      
});
app.post('/api/enviarsms',upload.array(),(req,res)=>{

    let number = req.query.celular ? req.query.celular : undefined;
    let mensaje = req.query.mensaje ? req.query.mensaje: undefined;
    
});
app.get('/api/app/validarversion', (req,res)=>{

    empeno.obtenerversionapp().then(respuesta=>{
        res.send(respuesta);
    })

});
app.get('/api/app/obtenerpreguntasf',upload.array(), (req,res)=>{

    empeno.obtenerpreguntasfrecuentas().then(respuesta=>{
        res.send(respuesta);
    })

});
app.get('/api/app/obtenerpreguntasporid',upload.array(), (req,res)=>{
    empeno.obtenerpreguntasporid(req.query.id).then(respuesta=>{
        res.send(respuesta);
    })

}); 
app.post('/api/app/dejanostuopinion',upload.array(), (req,res)=>{
    let asunto = req.body.asunto ? req.body.asunto : '';
    let mensaje = req.body.mensaje ? req.body.mensaje : '';
    if(mensaje !== ''){
        users.dejanostucomentario(asunto,mensaje).then(respuesta=>{
            res.send(respuesta);
        })
    }else{
        res.send("Error");
    }
});
app.get('/api/app/obtenertarjeta',upload.array(), (req,res)=>{
    libsodium.desencriptar("crsdNvciqm7MplMB0+uiIhzaotNux/fu8Y8OkwoBduyiNwE+LFhyZYxZrs0ZIdtillYtYfPg1Eo=").then(respuesta =>{ 
        res.send(respuesta);
    }) 

});   

//REGION USUARIOS
app.post('/api/usuarios/login',upload.array(),(req,res)=>{
    let usuario = req.body.user ? req.body.user : undefined;
    let password = req.body.password ? req.body.password : undefined;
    let correo = "NoCorreo";
    let celular ="0";
    if(usuario !== undefined & password !== undefined){
        const regex = /^[0-9]*$/;
        if(regex.test(usuario)){
            celular = usuario;
        }else{
            correo = usuario;
        }
        users.consultarLogin(celular,correo,password).then(respuesta=>{
            res.send(respuesta); 
        });
    }else{
        res.send("Favor de validar la información enviada.")
    }
})


///CARRITO DE COMPRAS

app.post('/api/carrito/nuevo',upload.array(),(req,res,next)=>{
    let codigo = req.body.codigo ? req.body.codigo : undefined;
    console.log(codigo);
        carrito.Altacarrito(codigo).then(respuesta=>{
            carrito.Obtenercarrito(respuesta).then(respuesta =>{
                res.send(respuesta);
            })
        });
})


app.post('/api/carrito/agregararticulo',upload.array(),(req,res,next)=>{
    let codigo = req.body.codigo ? req.body.codigo: undefined;
    let orden = req.body.orden ? req.body.orden : undefined;
        carrito.Agregarcarrito(orden,codigo).then(respuesta=>{
            carrito.Obtenercarrito(respuesta).then(respuesta =>{
                res.send(respuesta);
            })
        });
})

app.post('/api/carrito/eliminararticulo',upload.array(),(req,res,next)=>{
    let codigo = req.body.codigo ? req.body.codigo: undefined;
    let orden = req.body.orden ? req.body.orden : undefined;
        carrito.Borrararticulo(orden,codigo).then(respuesta=>{
            carrito.Obtenercarrito(respuesta).then(respuesta =>{
                res.send(respuesta);
            })
        });
})

app.get('/api/carrito',upload.array(), (req,res)=>{

    let orden = req.query.orden ? req.query.orden : undefined;

    carrito.Obtenercarritoventas(orden).then(respuesta =>{
        res.send(respuesta);
    })

}); 

//

app.post('/api/usuarios/registro',upload.array(),(req,res)=>{
    let Apellidop = req.body.Apellidop ? req.body.Apellidop : undefined;
    let Apellidom = req.body.Apellidom ? req.body.Apellidom : undefined;
    let Nombre = req.body.Nombre ? req.body.Nombre : undefined;
    let Celular = req.body.Celular ? req.body.Celular : undefined;
    let Correo = req.body.Correo ? req.body.Correo : undefined;
    let Contrasena = req.body.Contrasena ? req.body.Contrasena : undefined;

        users.RegistrarCliente(Apellidop,Apellidom,Nombre,Celular,Correo,Contrasena).then(respuesta=>{
            res.send(respuesta); 
        });
})


app.post('/api/usuarios/editarperfil',upload.array(),(req,res)=>{
    let Apellidop = req.body.Apellidop ? req.body.Apellidop : undefined;
    let Apellidom = req.body.Apellidom ? req.body.Apellidom : undefined;
    let Nombre = req.body.Nombre ? req.body.Nombre : undefined;
    let Celular = req.body.Celular ? req.body.Celular : undefined;
    let Correo = req.body.Correo ? req.body.Correo : undefined;
    let Contrasena = req.body.Contrasena ? req.body.Contrasena : undefined;
    let Usuario = req.body.Usuario ? req.body.Usuario : undefined ;
        users.EditarCliente(Usuario,Apellidop,Apellidom,Nombre,Celular,Correo,Contrasena).then(respuesta=>{
            res.send(respuesta); 
        });
})
app.post('/api/usuarios/agregarboleta',upload.array(),(req,res)=>{
    let usuario = req.body.usuario ? req.body.usuario : undefined;
    let boleta = req.body.boleta ? req.body.boleta : undefined;
    let letra = req.body.letra ? req.body.letra : undefined;
    let prestamo = req.body.prestamo ? req.body.prestamo : undefined;

        users.agregarboleta(usuario,boleta,letra,prestamo).then(respuesta=>{
            res.send(respuesta); 
        });
})

app.get('/api/usuarios/estadodecuenta',upload.array(),(req,res)=>{
    let user = req.query.codigousuario ? req.query.codigousuario : undefined;

        users.ObtenerSaldoBoleta(user).then(respuesta=>{
            res.send(respuesta);
        });
    
})
app.get('/api/usuarios/obtenercodigoregistro',upload.array(),(req,res)=>{
    celular = req.query.celular ? req.query.celular: undefined;
    users.ObtenerCodigoRegistro(celular).then(respuesta=>{
        if(respuesta != undefined){
            let Mensaje = "Tu codigo de verificacion maxilana es: "+respuesta.Codigo;
            sms.send(celular,Mensaje);
            res.send(respuesta);
        }else{
            let error={
                mensaje:"El celular ingresado ya se encuentra registrado."
            }
            res.send(error);
        }

    })
})
app.get('/api/usuarios/obtenercodigorecuperacion',upload.array(),(req,res)=>{
     let celular = req.query.celular ? req.query.celular: 0;
    let email = req.query.email ? req.query.email: "Novalido";
    users.ObtenerCodigoFgtPassword(celular,email).then(respuesta=>{
            if(respuesta != undefined){
            let Mensaje = "Se genero el codigo de recuperacion de contraseña: "+respuesta.CodigoGenerado;
            sms.send(respuesta.Celular,Mensaje);
            delete respuesta.CodigoGenerado;
            res.send(respuesta);
        }else{
            let error={
                mensaje:"El celular ingresado no se encuentra registrado."
             }
            res.send(error);
            }   
        });
});
app.get('/api/usuarios/Validarcodigo/:acccion',upload.array(),(req,res)=>{
    const {acccion}=req.params
    let user = req.query.user ? req.query.user: 0;
    let codigo = req.query.codigo ? req.query.codigo: "Novalido";
    if(acccion =='Alta'){
        users.Validarcodigo(user,codigo,2).then(respuesta=>{
    
            res.send(respuesta);
    
        });
    }else{
        users.Validarcodigo(user,codigo,1).then(respuesta=>{
    
            res.send(respuesta);
    
        });
    }

});
app.post('/api/usuarios/changepass',upload.array(),(req,res)=>{
    let usuario = req.body.usuario ? req.body.usuario: 0;
    let contrasena = req.body.password ? req.body.password: undefined;
     if(usuario !== 0 && contrasena !== undefined){
        users.CambiarContraseña(usuario,contrasena).then(respuesta=>{
    
            res.send(respuesta);
    
        });
    }else{

        let ress={
            response:false
        }
        res.send(ress);
    }

});

app.get('/api/usuarios/validarcodigorecuperacion',(req,res)=>{

})
app.post('/api/maxilanasms',upload.array(),(req,res)=>{
    if(req.body.celular !== undefined & req.body.mensaje !== undefined){
        sms.send(req.body.celular,req.body.mensaje).then(response=>{
            res.send(response);
        })
    
    }
    
});

app.get('/api/procesos/pagospendientes',(req,res)=>{
    procesos.ejecutarprocesodepagos().then(respuesta=>{
        res.send(respuesta);
    });
});

app.post('/api/subastas/encrypt',upload.array(),(req,res)=>{

    var tjt = req.body.datacard ? req.body.datacard : undefined;

    var part1Tjt = (tjt.substring(0,8));
    var part2Tjt = (tjt.substring(8,16));


    var mes = req.body.mm ? req.body.mm : undefined;
    var anio = req.body.aa ? req.body.aa : undefined
    
    libsodium.encriptar(part1Tjt).then(respuesta=>{
        var tarjeta = respuesta;
        libsodium.encriptar(part2Tjt).then(respuesta=>{
            var tarjetaPart2 = respuesta;
                libsodium.encriptar(mes).then(respuesta=>{
                var expmes = respuesta;
                libsodium.encriptar(anio).then(respuesta=>{
                    var expanio = respuesta;
                    let resp ={
                        data_ccnumOne: tarjeta,
                        data_ccnumtwo : tarjetaPart2,
                        data_ccexpmes: expmes,
                        data_ccexpanio: expanio
                    }
                    res.send(resp);
        
                })
            })
        })
    })

 
});

app.post('/api/subastas/decrypt',upload.array(),(req,res)=>{

    var tjt = req.body.datacardOne ? req.body.datacardOne : undefined;
    var tjt2 = req.body.datacardTwo ? req.body.datacardTwo : undefined;
    var mes = req.body.mm ? req.body.mm : undefined;
    var anio = req.body.aa ? req.body.aa : undefined;

    libsodium.desencriptar(tjt).then(respuesta=>{
        var part1Tjr="4556"+respuesta+"0000";
        libsodium.desencriptar(tjt2).then(respuesta=>{
            var part2Tjr="4556"+respuesta+"0000";
            libsodium.desencriptar(mes).then(respuesta=>{
                var expmes=respuesta;
                libsodium.desencriptar(anio).then(respuesta=>{
                    var expanio=respuesta;
                    let resp ={
                        data_ccnumOne: part1Tjr,
                        data_ccnumtwo : part2Tjr,
                        data_ccexpmes: expmes,
                        data_ccexpanio: expanio
                    }
                    res.send(resp);
                })
            })
        })
    })

});

//Todas las rutas
app.get('/api/',(req,res)=>{
    res.send(listEndpoints(app));
});

app.get('/api/fecha',(req,res)=>{
    let Cliente = 'ERICK PAUL GARCIA RAMOS'
    let codigosucursal = '1'
    let sucnom = 'Matriz'
    let boleta = '120222'
    let monto = '1,22.00'
    let codigo_aut = '789521'
    let referencia='510919698089'
    let fecha ='2021-09-08 09:33:32'
    let CorreoPersonal='egarcia@maxilana.com'
    let correoelectronico='egarcia@maxilana.com'
    emailempeno.sendemail(Cliente,codigosucursal,sucnom,boleta,monto,codigo_aut,referencia,fecha,CorreoPersonal,correoelectronico);
});

app.get('/api/reset/',(req,res)=>{
    var id = uniqid.v4();
    fs.writeFile('./tmp/restart.txt', id, 'utf-8', function(err, data) {
        if (err) throw err;
            res.send("LA API SE REINICIÓ CON ÉXITO");  
    });

});

var server = app.listen(PORT,()=> 
console.log('server running on port '+ PORT));

server.keepAliveTimeout = 0;
server.headersTimeout = 0;


///ANTES DE CORRER LA APLICACIÓN EN WINDOWS CORRER LA SIGUIENTE LINEA DECÓDIGO//
// npm install --platform=win32 --arch=x64 sharp // ESTO PARA QUE CAMBIE EL ENTORNO DE SHARP Y PUEDA CORRER
//AL SUBIR AL PRODUCCIÓN , CORRER LA SIGUIENTE LINEA //
// npm install --platform=linux --arch=x64 sharp // ESTO POR QUE EL SERVIDOR SE ENCUENTRA EN LINUX.
