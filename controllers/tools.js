const sql = require('mssql');

const sqlConfig = {
    user: 'sa',
    password: 'napire960702',
    database: 'ConsultasWEB',
    server: '10.0.0.232',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true, // change to true for local dev / self-signed certs
    }
}

const VerifySQLdata = async ({ 
    listaRef, listaPP, listaVtas,
    totalBoletas, totalPP, totalVtas,
    boletas, pp, vtas,
 }) => {
    const oReturn = {
        ref:[],
        refDuplicadas:[],
        refRowsFaltantes:[],
        refRowsSobrantes:[],
        refFaltante:0,
        refSobrante:0,
        pp:[],
        ppDuplicadas:[],
        ppRowsFaltantes:[],
        ppRowsSobrantes:[],
        ppFaltante:0,
        ppSobrante:0,
        vtas:[],
        vtasDuplicadas:[],
        vtasRowsFaltantes:[],
        vtasRowsSobrantes:[],
        vtasFaltante:0,
        vtasSobrante:0,
    }

    try {
        const conn = new sql.ConnectionPool(sqlConfig);
        const cn = await conn.connect();
        if(listaRef && listaRef != ''){
            const sqlquery = `select count(*) as total, reference from respuestaspw2 where reference IN (
                ${listaRef}
                ) group by reference order by total desc`;
            const req = new sql.Request(cn);
    
            const resp = await req.query(sqlquery);
            oReturn.ref = resp.recordset;
            oReturn.refDuplicadas = oReturn.ref?.filter((el)=>{return el.total > 1});
            oReturn.refFaltante = totalBoletas>oReturn.ref.length?(totalBoletas-oReturn.ref.length):0;
            oReturn.refSobrante = totalBoletas<oReturn.ref.length?(oReturn.ref.length-totalBoletas):0;
            if(oReturn.refFaltante > 0){
                oReturn.refRowsFaltantes = boletas.map((elm, index, arr)=>{
                    return {
                        ...elm, 
                        existe:oReturn.ref.find((elf)=>{
                           if(elf.reference==elm.referencia) return true;
                        })?true:false
                    }
                }).filter((ef)=>{return ef.existe == false});
            }else if(oReturn.refSobrante > 0){
                oReturn.refRowsSobrantes = oReturn.ref.map((elm, index, arr)=>{
                    return {
                        ...elm, 
                        existe:boletas.find((elf)=>{
                           if(elf.referencia==elm.reference) return true;
                        })?true:false
                    }
                }).filter((ef)=>{return ef.existe == false});
            }
        }
        if(listaPP && listaPP != ''){
            const sqlquery = `select count(*) as total, reference from prestamos.dbo.respuestaspp_pw2 where reference in (
                ${listaPP}
                ) group by reference order by total desc`;
            const req = new sql.Request(cn);
    
            const resp = await req.query(sqlquery);
            oReturn.pp = resp.recordset;
            oReturn.ppDuplicadas = oReturn.pp?.filter((el)=>{return el.total > 1})
            oReturn.ppFaltante = totalPP>oReturn.pp.length?(totalPP-oReturn.pp.length):0;
            oReturn.ppSobrante = totalPP<oReturn.pp.length?(oReturn.pp.length-totalPP):0;
            if(oReturn.ppFaltante > 0){
                oReturn.ppRowsFaltantes = oReturn.pp.map((elm, index, arr)=>{
                    return {
                        ...elm, 
                        existe:arr.find((elf)=>{
                           if(elf.reference==elm.reference) return true;
                        })?true:false
                    }
                })
            }else if(oReturn.ppSobrante > 0){
                oReturn.ppRowsSobrantes = pp.map((elm, index, arr)=>{
                    return {
                        ...elm, 
                        existe:oReturn.pp.find((elf)=>{
                           if(elf.reference==elm.reference) return true;
                        })?true:false
                    }
                })
            }
        }
        if(listaVtas && listaVtas != ''){
            const sqlquery = `select count(*) as total, reference from respuestapw2remate where reference in (
                ${listaVtas}
                ) group by reference order by total desc`;
            const req = new sql.Request(cn);
    
            const resp = await req.query(sqlquery);
            oReturn.vtas = resp.recordset;
            oReturn.vtasDuplicadas = oReturn.vtas?.filter((el)=>{return el.total > 1})
            oReturn.vtasFaltante = totalVtas>oReturn.vtas.length?(totalVtas-oReturn.vtas.length):0;
            oReturn.vtasSobrante = totalVtas<oReturn.vtas.length?(oReturn.vtas.length-totalVtas):0;
        }

        if(oReturn.refDuplicadas > 0) {

        }




        await conn.close();

        return oReturn;
    } catch (error) {
        return oReturn;
    }
}

module.exports = {
    VerifySQLdata,
}