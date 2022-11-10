const con = require("../../db/conexion");
const plazas = require("../plazas/consultas");
let Resultado = [];
let Obtenersucursales = async function consultarSucursal(){

    return new Promise(function(resolve,reject){
        let arraysuc =[];
    let arraysucporciudad = [];
    let query = 'SELECT * FROM sucursales order by nombre asc';
        con.connection.query(query, function (error, results, fields) {
            plazas.Consultar();
            plazas.Consultar().then(respuesta=>{
                Resultado = JSON.parse(JSON.stringify(results));
                for(var i = 0; i < respuesta.length; i++){
                    for(var j = 0; j < Resultado.length; j++){
                        if(respuesta[i].id== Resultado[j].ciudad && Resultado[j].activo == 1){
                            arraysuc.push({
                                id: Resultado[j].id,
                                slug: Resultado[j].slug,
                                numero: Resultado[j].numero,
                                nombre: Resultado[j].nombre,
                                direccion: Resultado[j].direccion,
                                telefono: Resultado[j].telefono,
                                codigociudad: Resultado[j].ciudad,
                                estado: Resultado[j].estado,
                                img_croquis: Resultado[j].img_croquis,
                                activo: Resultado[j].activo,
                                HorarioLV: Resultado[j].HorarioLV,
                                HorarioS: Resultado[j].HorarioS,
                                HorarioD: Resultado[j].HorarioD,
                                constancia: Resultado[j].constancia,
                                identifcadorparamapa: Resultado[j].identifcadorparamapa,
                                whatsapp: Resultado[j].whatsapp,
                                HorarioConFormato: Resultado[j].HorarioConFormato,
                                whatsappConFormato: Resultado[j].whatsappConFormato,
                                correoelectronicooficial: 'info@maxilana.com',
                                correoelectronico: Resultado[j].correoelectronico,
                                HoraAperturaLV: Resultado[j].HoraAperturaLV,
                                HoraCierreLV: Resultado[j].HoraCierreLV,
                                HoraAperturaS: Resultado[j].HoraAperturaS,
                                HoraCierreS: Resultado[j].HoraCierreS,
                                HoraAperturaD: Resultado[j].HoraAperturaD,
                                HoraCierreD: Resultado[j].HoraCierreD,
                                longitud : Resultado[j].coordenada.x,
                                latitud : Resultado[j].coordenada.y,
                            });
                        }
                    }
                    arraysucporciudad.push({
                        id: respuesta[i].id,
                        ciudad: respuesta[i].nombre,
                        slug: respuesta[i].slug,
                        totalsucursales:arraysuc.length,
                        sucursales:arraysuc
                    });
                    arraysuc=[];
                   
                }
                resolve(arraysucporciudad)
               })
              
         });
    });
}
let Obtenersucursalesciudad = async function consultarSucursalCiudad(ciudad){
    let arraysuc =[];
    return new Promise(function(resolve,reject){
    let query = 'SELECT s.id,s.slug,s.numero,s.nombre,s.direccion,s.telefono,s.ciudad,s.estado,s.img_croquis,s.activo,s.HorarioLV,s.HorarioS,s.HorarioD,s.constancia,s.identifcadorparamapa,s.whatsapp,s.HorarioConFormato,s.HorarioConFormato,s.whatsappConFormato,s.correoelectronico,s.HoraAperturaLV,s.HoraCierreLV,s.HoraAperturaS,s.HoraCierreS,s.HoraAperturaD,s.HoraCierreD,coordenada FROM sucursales s inner join ciudades c on c.id=s.ciudad where s.activo=1 and c.slug='+"'"+ciudad+"' order by nombre asc"; 
    con.connection.query(query, function (error, Resultado, fields) {
            console.log(query)
            for(var j = 0; j < Resultado.length; j++){
            arraysuc.push({
                id: Resultado[j].id,
                slug: Resultado[j].slug,
                numero: Resultado[j].numero,
                nombre: Resultado[j].nombre,
                direccion: Resultado[j].direccion,
                telefono: Resultado[j].telefono,
                codigociudad: Resultado[j].ciudad,
                estado: Resultado[j].estado,
                img_croquis: Resultado[j].img_croquis,
                activo: Resultado[j].activo,
                HorarioLV: Resultado[j].HorarioLV,
                HorarioS: Resultado[j].HorarioS,
                HorarioD: Resultado[j].HorarioD,
                constancia: Resultado[j].constancia,
                identifcadorparamapa: Resultado[j].identifcadorparamapa,
                whatsapp: Resultado[j].whatsapp,
                HorarioConFormato: Resultado[j].HorarioConFormato,
                whatsappConFormato: Resultado[j].whatsappConFormato,
                correoelectronicooficial: 'info@maxilana.com',
                correoelectronico: Resultado[j].correoelectronico,
                HoraAperturaLV: Resultado[j].HoraAperturaLV,
                HoraCierreLV: Resultado[j].HoraCierreLV,
                HoraAperturaS: Resultado[j].HoraAperturaS,
                HoraCierreS: Resultado[j].HoraCierreS,
                HoraAperturaD: Resultado[j].HoraAperturaD,
                HoraCierreD: Resultado[j].HoraCierreD,
                longitud : Resultado[j].coordenada.x,
                latitud : Resultado[j].coordenada.y,
                });
            }
            Resultado = JSON.parse(JSON.stringify(arraysuc));
            resolve(Resultado)
         });
    });
}
let Obtenersucursalporid= async function consultarSucursaporid(id){
    let arraysuc =[];
    return new Promise(function(resolve,reject){
        const regex = /^[0-9]*$/;
        let query=''
        if(regex.test(id)){
            query = 'SELECT * FROM sucursales where activo=1 and numero='+id;
        }else{
            query = 'SELECT * FROM sucursales where activo=1 and slug='+"'"+id+"'";
        }
        con.connection.query(query, function (error, Resultado, fields) {
            try{
                arraysuc={
                    id: Resultado[0].id,
                    slug: Resultado[0].slug,
                    numero: Resultado[0].numero,
                    nombre: Resultado[0].nombre,
                    direccion: Resultado[0].direccion,
                    telefono: Resultado[0].telefono,
                    codigociudad: Resultado[0].ciudad,
                    estado: Resultado[0].estado,
                    img_croquis: Resultado[0].img_croquis,
                    activo: Resultado[0].activo,
                    HorarioLV: Resultado[0].HorarioLV,
                    HorarioS: Resultado[0].HorarioS,
                    HorarioD: Resultado[0].HorarioD,
                    constancia: Resultado[0].constancia,
                    identifcadorparamapa: Resultado[0].identifcadorparamapa,
                    whatsapp: Resultado[0].whatsapp,
                    HorarioConFormato: Resultado[0].HorarioConFormato,
                    whatsappConFormato: Resultado[0].whatsappConFormato,
                    correoelectronicooficial: 'info@maxilana.com',
                    correoelectronico: Resultado[0].correoelectronico,
                    HoraAperturaLV: Resultado[0].HoraAperturaLV,
                    HoraCierreLV: Resultado[0].HoraCierreLV,
                    HoraAperturaS: Resultado[0].HoraAperturaS,
                    HoraCierreS: Resultado[0].HoraCierreS,
                    HoraAperturaD: Resultado[0].HoraAperturaD,
                    HoraCierreD: Resultado[0].HoraCierreD,
                    longitud : Resultado[0].coordenada.x,
                    latitud : Resultado[0].coordenada.y,
                    };
                Resultado = JSON.parse(JSON.stringify(arraysuc));
                resolve(Resultado);
            }catch(e){
               let error={
                   error: 'No hay información para mostrar'
               }
               resolve(error);
           }

         });
    });
}
module.exports={
    Obtenersucursales,
    Obtenersucursalesciudad,
    Obtenersucursalporid
}
