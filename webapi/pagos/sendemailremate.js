const mailer = require('../../node_modules/nodemailer');

let sendemail = async function datos(pedido,nombrerecibe,celular,domicilio,colonia,codigopostal,municipio,Estado,instruccion,articulo,upc,monto,envio,total,personal,correo){


  var hoy = new Date();
  var hoy2 = new Date();
  
  var FechaInicial = sumarDias(hoy,4); 
  var FechaFinal = sumarDias(hoy2,7);
  
  var diainicial = FechaInicial.getDate();
  var diafinal = FechaFinal.getDate();
  
  var mesInicial = FechaInicial.getMonth()+1;
  var mesFinal = FechaInicial.getMonth()+1;
  
  var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  
  var MesUnoConLetra = meses[mesInicial-1];
  var MesDosConLetra = meses[mesFinal-1];

  if(instruccion == 'null'){
    instruccion ='';
  }

    return new Promise(function(resolve,reject){
    let jConfig = {
            "host":"smtp.office365.com", 
            "port":"587", 
            "secure":false, 
            "auth":{ 
                    "type":"login", 
                    "user":"webmaxilana@maxilana.com", 
                    "pass":"cceMaxiWeb2015" 
                }
            };
    let body ='<table id="m_-6863763375563930348container" style="width:640px;color:rgb(51,51,51);margin:0 auto;border-collapse:collapse">';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="padding:0 20px 20px 20px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348main" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348header" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr>';
    body = body +'<td colspan="3" style="width:100%;background-color:#003681">';
    body = body +'<img name="m_-7870061969043156846_header_logo" src="http://grupoalvarez.com.mx:8089/MaxilanaWEB/assets/BarrasuperiorCorreo.png" border="0" alt="" class="CToWUd">';
    body = body +'</td>';
    body = body +'</tr>';
    body = body +'</tbody>';
    body = body +'<tr> ';
    body = body +'<td colspan="3" style="text-align:right;padding:7px 0 5px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h2 style="font-size:20px;line-height:24px;margin:0;padding:0;font-weight:normal;color:rgb(0,0,0)!important">Confirmaci&oacute;n de pedido</h2>';
    body = body +'<br></td>';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348summary" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Hola,</h3> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"> Gracias por su pedido.';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="border-collapse:collapse"> ';
    body = body +'</table> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="width:100%;border-top:3px solid rgb(45,55,65);border-collapse:collapse" id="m_-6863763375563930348criticalInfo"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td  <p style="margin:2px 0 9px 0;font:14px Arial,sans-serif"> <span style="font-size:14px;color:rgb(102,102,102)">';
    body = body +'Tu pedido se enviar&aacute; a:</span> <br> <b> '+nombrerecibe+' <br>';
    body = body +'Contacto:'+celular+'<br>';
    body = body +'Domicilio:'+domicilio+','+colonia+','+codigopostal+'<br> ';
    body = body +''+municipio+','+Estado+'<br> M&eacute;xico<br> Canal de venta: Aplicación </b> <p style="margin:2px 0 9px 0;font:14px Arial,sans-serif">';
    body = body +'Instrucciones: '+instruccion+'</p></td> ';
    body = body +'<td style="margin:2px 0 9px 0;font:14px Arial,sans-serif"><span style="font-size:14px;color:rgb(102,102,102)">';
    body = body +'Su pedido ser&aacute; entregado del '+diainicial+' de '+MesUnoConLetra+' al '+diafinal+' de '+MesDosConLetra+'</span>';
    body = body +'</td>';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="border-bottom:1px solid rgb(204,204,204);vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Resumen del pedido</h3> </td> ';
    body = body +'</tr> ';
    body = body +'<td style="padding-left:2px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="width:95%;border-collapse:collapse" id="m_-6863763375563930348costBreakdownNoAsin"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
    body = body +'Articulo: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
    body = body +''+articulo+'</td> ';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
    body = body +'C&oacute;digo: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
    body = body +''+upc+'</td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">'; 
    body = body +'Precio: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> ';
    body = body +'$'+formatMoney(monto)+' </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> ';
    body = body +'Envio: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> ';
    body = body +'$'+formatMoney(envio)+'</td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> Subtotal: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">$'+formatMoney(total)+'</td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="font-size:14px;font-weight:bold;font:12px/16px Arial,sans-serif;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-family:Arial,sans-serif"> <strong>';
    body = body +'Total :</strong> </td> ';
    body = body +'<td style="font-size:14px;font-weight:bold;font:14px/16px Arial,sans-serif;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-family:Arial,sans-serif"> <strong>';
    body = body +'$'+formatMoney(total)+'</strong> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="border-top:1px solid rgb(234,234,234);padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348selfService" style="width:100%;border-collapse:collapse"> ';
    body = body +'</table> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348closing" style="width:100%;padding:0 0 0 0;border-collapse:none"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"><br> <br>Esperamos volver a verte pronto.<br> <span style="font-size:16px;font-weight:bold"> <strong><a href="http://maxilana.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://Amazon.com.mx&amp;source=gmail&amp;ust=1591545364432000&amp;usg=AFQjCNGjL2QKniZLm2uCQECs5sZCsx0dJw">Maxilana.com</a></strong> </span> </p> </td> ';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348marketingContent" style="width:100%;border-bottom:1px solid rgb(234,234,234);border-collapse:collapse;padding:0"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="padding:10px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">';
    body = body +'<table id="m_-6863763375563930348main" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr>';
    body = body +'<td colspan="3" style="width:100%;background-color:#003681">';
    body = body +'<img name="m_-7870061969043156846_header_logo" src="http://grupoalvarez.com.mx:8089/MaxilanaWEB/assets/EsrLogo.png" border="0" alt="" class="CToWUd">';
    body = body +'</td>';
    body = body +'</tr>';
    body = body +'</tbody>';
    body = body +'</table>'
    let email ={ 
        from:"webmaxilana@maxilana.com",  //remitente
        to: correo,  //destinatario
        subject:"Gracias por su pedido - Maxilana", //asunto del correo
        bcc : personal, // copiaoculta
        html: body // cuerpo
    };

  let CreateTransport= mailer.createTransport(jConfig);
  CreateTransport.sendMail(email, function (error, info) { 
    if(!error){ 
        createTransport.close(); 
      }else{
        createTransport.close(); 
      }

    });
  });   
}


let sendemailprueba = async function datos(data,nombrerecibe,celular,domicilio,colonia,codigopostal,municipio,Estado,instruccion,personal,correo){

  console.log(data);
  var hoy = new Date();
  var hoy2 = new Date();
  
  var FechaInicial = sumarDias(hoy,4); 
  var FechaFinal = sumarDias(hoy2,7);
  
  var diainicial = FechaInicial.getDate();
  var diafinal = FechaFinal.getDate();
  
  var mesInicial = FechaInicial.getMonth()+1;
  var mesFinal = FechaFinal.getMonth()+1;
  
  var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  
  var MesUnoConLetra = meses[mesInicial-1];
  var MesDosConLetra = meses[mesFinal-1];

  if(instruccion == 'null'){
    instruccion ='';
  }

    return new Promise(function(resolve,reject){
    let jConfig = {
            "host":"smtp.office365.com", 
            "port":"587", 
            "secure":false, 
            "auth":{ 
                    "type":"login", 
                    "user":"webmaxilana@maxilana.com", 
                    "pass":"cceMaxiWeb2015" 
                }
            };
    let body ='<table id="m_-6863763375563930348container" style="width:640px;color:rgb(51,51,51);margin:0 auto;border-collapse:collapse">';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="padding:0 20px 20px 20px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348main" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348header" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr>';
    body = body +'<td colspan="3" style="width:100%;background-color:#003681">';
    body = body +'<img name="m_-7870061969043156846_header_logo" src="http://grupoalvarez.com.mx:8089/MaxilanaWEB/assets/BarrasuperiorCorreo.png" border="0" alt="" class="CToWUd">';
    body = body +'</td>';
    body = body +'</tr>';
    body = body +'</tbody>';
    body = body +'<tr> ';
    body = body +'<td colspan="3" style="text-align:right;padding:7px 0 5px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h2 style="font-size:20px;line-height:24px;margin:0;padding:0;font-weight:normal;color:rgb(0,0,0)!important">Confirmaci&oacute;n de pedido</h2>';
    body = body +'<br></td>';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348summary" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Hola,</h3> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"> Gracias por su pedido.';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="border-collapse:collapse"> ';
    body = body +'</table> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="width:100%;border-top:3px solid rgb(45,55,65);border-collapse:collapse" id="m_-6863763375563930348criticalInfo"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td  <p style="margin:2px 0 9px 0;font:14px Arial,sans-serif"> <span style="font-size:14px;color:rgb(102,102,102)">';
    body = body +'Tu pedido se enviar&aacute; a:</span> <br> <b> '+nombrerecibe+' <br>';
    body = body +'Contacto:'+celular+'<br>';
    body = body +'Domicilio:'+domicilio+','+colonia+','+codigopostal+'<br> ';
    body = body +''+municipio+','+Estado+'<br> M&eacute;xico<br> Canal de venta: Web </b> <p style="margin:2px 0 9px 0;font:14px Arial,sans-serif">';
    body = body +'Instrucciones: '+instruccion+'</p></td> ';
    body = body +'<td style="margin:2px 0 9px 0;font:14px Arial,sans-serif"><span style="font-size:14px;color:rgb(102,102,102)">';
    body = body +'Su pedido ser&aacute; entregado del '+diainicial+' de '+MesUnoConLetra+' al '+diafinal+' de '+MesDosConLetra+'</span>';
    body = body +'</td>';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="border-bottom:1px solid rgb(204,204,204);vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Resumen del pedido</h3> </td> ';
    body = body +'</tr> ';
    body = body +'<td style="padding-left:2px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="width:95%;border-collapse:collapse" id="m_-6863763375563930348costBreakdownNoAsin"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    for(var i = 0; i < data.carrito.length;i++){
      let dep = data.carrito[i];
      console.log(dep)
      body = body +'<tr> ';
      body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
      body = body +'<b> '+dep.plaza+'<b>  </td> ';
      body = body +'</tr> ';
      for(var j =0; j < dep.productos.length;j++){
        let bd = dep.productos[j];
        body = body +'<tr> ';
        body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
        body = body +'Articulo: </td> ';
        body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
        body = body +''+bd.nombre+'</td> ';
        body = body +'</tr>';
        body = body +'<tr> ';
        body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
        body = body +'C&oacute;digo: </td> ';
        body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">';
        body = body +''+bd.id+'</td> ';
        body = body +'</tr> ';
        body = body +'<tr> ';
        body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">'; 
        body = body +'Precio: </td> ';
        body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> ';
        body = body +'$'+formatMoney(bd.precio)+' </td> ';
        body = body +'</tr> ';
        body = body +'<br> ';
      }
    }
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> ';
    body = body +'Envio: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> ';
    body = body +'$'+formatMoney(data.pago.envio)+'</td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> Subtotal: </td> ';
    body = body +'<td style="width:70%;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif">$'+formatMoney(data.pago.subtotal)+'</td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="font-size:14px;font-weight:bold;font:12px/16px Arial,sans-serif;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-family:Arial,sans-serif"> <strong>';
    body = body +'Total :</strong> </td> ';
    body = body +'<td style="font-size:14px;font-weight:bold;font:14px/16px Arial,sans-serif;text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-family:Arial,sans-serif"> <strong>';
    body = body +'$'+formatMoney(data.pago.total)+'</strong> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="border-top:1px solid rgb(234,234,234);padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348selfService" style="width:100%;border-collapse:collapse"> ';
    body = body +'</table> </td> ';
    body = body +'</tr> ';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348closing" style="width:100%;padding:0 0 0 0;border-collapse:none"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"><br> <br>Esperamos volver a verte pronto.<br> <span style="font-size:16px;font-weight:bold"> <strong><a href="http://maxilana.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://Amazon.com.mx&amp;source=gmail&amp;ust=1591545364432000&amp;usg=AFQjCNGjL2QKniZLm2uCQECs5sZCsx0dJw">Maxilana.com</a></strong> </span> </p> </td> ';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348marketingContent" style="width:100%;border-bottom:1px solid rgb(234,234,234);border-collapse:collapse;padding:0"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="padding:10px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">';
    body = body +'<table id="m_-6863763375563930348main" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr>';
    body = body +'<td colspan="3" style="width:100%;background-color:#003681">';
    body = body +'<img name="m_-7870061969043156846_header_logo" src="http://grupoalvarez.com.mx:8089/MaxilanaWEB/assets/EsrLogo.png" border="0" alt="" class="CToWUd">';
    body = body +'</td>';
    body = body +'</tr>';
    body = body +'</tbody>';
    body = body +'</table>'
    let email ={ 
        from:"webmaxilana@maxilana.com",  //remitente
        to: correo,  //destinatario
        subject:"Gracias por su pedido - Maxilana", //asunto del correo
        bcc : personal, // copiaoculta
        html: body // cuerpo
    };

  let CreateTransport= mailer.createTransport(jConfig);
  CreateTransport.sendMail(email, function (error, info) { 
    if(!error){ 
        createTransport.close(); 
      }else{
        createTransport.close(); 
      }

    });
  });   
}

function sumarDias(fecha, dias){
	fecha.setDate(fecha.getDate() + dias);
	return fecha;
  }
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 
  function sumarDias(fecha, dias){
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
    }
    function formatMoney(number, decPlaces, decSep, thouSep) {
      decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
      decSep = typeof decSep === "undefined" ? "." : decSep;
      thouSep = typeof thouSep === "undefined" ? "," : thouSep;
      var sign = number < 0 ? "-" : "";
      var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
      var j = (j = i.length) > 3 ? j % 3 : 0;
  
      return sign +
          (j ? i.substr(0, j) + thouSep : "") +
          i.substr(j).replace(/(\decSep{3})(?=\decSep)/g, "$1" + thouSep) +
          (decPlaces ? decSep + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
  }
module.exports={
    sendemail,
    sendemailprueba
}