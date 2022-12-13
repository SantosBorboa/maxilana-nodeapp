const express = require('express');
const Router = express.Router();

const mailer = require('nodemailer');
const Logger = require('../../Middlewares/logger.js');
const MailConf = require('../../config/mail.js');

Router.post('/api/mail/mailtesting', (req, res, next) => {
    const body = `<table id="m_-6863763375563930348container" style="width:640px;color:rgb(51,51,51);margin:0 auto;border-collapse:collapse">
    <tbody>
    <tr> 
    <td style="padding:0 20px 20px 20px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table id="m_-6863763375563930348main" style="width:100%;border-collapse:collapse"> 
    <tbody>
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table id="m_-6863763375563930348header" style="width:100%;border-collapse:collapse"> 
    <tbody>
    <tr>
    <td colspan="3" style="width:100%;background-color:#003681">
    <img name="m_-7870061969043156846_header_logo" src="https://grupoalvarez.com.mx:4430/MaxilanaWEB/assets/BarrasuperiorCorreo.png" border="0" alt="" class="CToWUd">
    </td>
    </tr>
    </tbody>
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table id="m_-6863763375563930348summary" style="width:100%;border-collapse:collapse"> 
    <tbody>
    </tbody>
    </table> </td> 
    </tr> 
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table style="border-collapse:collapse"> 
    </table> </td> 
    </tr> 
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table style="width:100%;border-top:3px solid rgb(45,55,65);border-collapse:collapse" id="m_-6863763375563930348criticalInfo"> 
        <tbody>
            <tr> 
                <td  <p style="margin:2px 0 9px 0;font:14px Arial,sans-serif"> 
                    <span style="font-size:14px;color:rgb(102,102,102)"><b>Nombre: </span>  ' + nombre + ' <br>
                    Email : ' + correoelectronico + '<br>
                    Ciudad : ' + ciudad + '<br>
                    Tema : ' + tema + '<br>
                    Asunto : ' + asunto + '<br>
                    Mensaje : ' + mensaje + '<br>
                    <td style="margin:2px 0 9px 0;font:14px Arial,sans-serif"><span style="font-size:14px;color:rgb(102,102,102)"></span>
                </td>
            </tr> 
        </tbody>
    </table> </td> 
    </tr>
    <td style="padding-left:2px;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table style="width:95%;border-collapse:collapse" id="m_-6863763375563930348costBreakdownNoAsin"> 
    <tbody>
    <tr> 
    <td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> 
    </tr> 
    <tr> 
    <td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> 
    </tr> 
    <tr> 
    <td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> 
    </tr> 
    <tr> 
    <td colspan="2" style="text-align:left!important;line-height:18px;padding:0 10px 0 0;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> <p style="margin:1px 0 0 0;font:13px/18px Arial,sans-serif"></p> </td> 
    </tr> 
    <tr> 
    <td colspan="2" style="padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> 
    </tr> 
    <tr> 
    <td colspan="2" style="border-top:1px solid rgb(234,234,234);padding:0 0 16px 0;text-align:left!important;line-height:18px;vertical-align:top;font-size:13px;font-family:Arial,sans-serif"> </td> 
    </tr> 
    </tbody>
    </table> </td> 
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table id="m_-6863763375563930348selfService" style="width:100%;border-collapse:collapse"> 
    </table> </td> 
    </tr> 
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table id="m_-6863763375563930348closing" style="width:100%;padding:0 0 0 0;border-collapse:none"> 
    <tbody>
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"><br> <br>Esperamos volver a verte pronto.<br> <span style="font-size:16px;font-weight:bold"> <strong><a href="http://maxilana.com" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://Amazon.com.mx&amp;source=gmail&amp;ust=1591545364432000&amp;usg=AFQjCNGjL2QKniZLm2uCQECs5sZCsx0dJw">Maxilana.com</a></strong> </span> </p> </td> 
    </tr> 
    </tbody>
    <tr> 
    <td style="vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif"> 
    <table id="m_-6863763375563930348marketingContent" style="width:100%;border-bottom:1px solid rgb(234,234,234);border-collapse:collapse;padding:0"> 
    <tbody>
    <tr> 
    <td style="padding:10px 0;vertical-align:top;font-size:13px;line-height:18px;font-family:Arial,sans-serif">
    <table id="m_-6863763375563930348main" style="width:100%;border-collapse:collapse"> 
    <tbody>
    <tr>
    <td colspan="3" style="width:100%;background-color:#003681">
    <img name="m_-7870061969043156846_header_logo" src="https://grupoalvarez.com.mx:4430/MaxilanaWEB/assets/EsrLogo.png" border="0" alt="" class="CToWUd">
    </td>
    </tr>
    </tbody>
    </table>`
    let email = {
        from: "webmaxilana@maxilana.com",  //remitente
        to: 'arthur.borboa.r@gmail.com',  //destinatario
        subject: "Gracias por su pedido - Maxilana", //asunto del correo
        bcc: '', // copiaoculta
        html: body // cuerpo
    };

    let CreateTransport = mailer.createTransport(MailConf);
    CreateTransport.sendMail(email, function (error, info) {
        CreateTransport.close()
        if (!error) {
            return res.send(true)
        } else {
            return res.send(error)
        }
    });
})

module.exports = Router;