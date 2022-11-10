const mailer = require('../../node_modules/nodemailer');
let sendemail = async function datos(tema,nombre,correoelectronico,ciudad,asunto,mensaje){

    return new Promise(function(resolve,reject){
    let jConfig = {
            "host":"smtp.office365.com", 
            "port":"587", 
            "secure":false, 
            "auth":{ 
                    "type":"login", 
                    "user":"webmaxilana@maxilana.com", 
                    "pass":"M@xiW3b2022" 
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
    body = body +'<td colspan="3" style="text-align:right;padding:7px 0 5px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h2 style="font-size:20px;line-height:24px;margin:0;padding:0;font-weight:normal;color:rgb(0,0,0)!important">Contacto cliente</h2>';
    body = body +'</td>';
    body = body +'</tr>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table id="m_-6863763375563930348summary" style="width:100%;border-collapse:collapse"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> <h3 style="font-size:18px;color:rgb(204,102,0);margin:15px 0 0 0;font-weight:normal">Hola, un cliente solitó comunicarse:</h3> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif">';
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
    body = body +'<b>Nombre: </span>  '+nombre+' <br>';
    body = body +'Email : '+correoelectronico+'<br>';
    body = body +'Ciudad : '+ciudad+'<br>';
    body = body +'Tema : '+tema+'<br>';
    body = body +'Asunto : '+asunto+'<br>';
    body = body +'Mensaje : '+mensaje+'<br>';
    body = body +'<td style="margin:2px 0 9px 0;font:14px Arial,sans-serif"><span style="font-size:14px;color:rgb(102,102,102)">';
    body = body +'</span>';
    body = body +'</td>';
    body = body +'</tr> ';
    body = body +'</tbody>';
    body = body +'</table> </td> ';
    body = body +'</tr>';
    body = body +'<td style="padding-left:2px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> ';
    body = body +'<table style="width:95%;border-collapse:collapse" id="m_-6863763375563930348costBreakdownNoAsin"> ';
    body = body +'<tbody>';
    body = body +'<tr> ';
    body = body +'<td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> ';
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
        to: 'info@maxilana.com',  //destinatario
        subject:"Contácto cliente - Maxilana",
        html: body,// cuerpo,
        replyTo :correoelectronico
    };

  let CreateTransport= mailer.createTransport(jConfig);
  CreateTransport.sendMail(email, function (error, info) { 
    if(!error){ 
      console.log("se envió");
      CreateTransport.close(); 
      }else{
        console.log("no se envió");
        CreateTransport.close(); 
      }

    });
  });   
  
}

module.exports={
    sendemail
}