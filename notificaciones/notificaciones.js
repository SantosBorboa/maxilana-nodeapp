const admin = require('firebase-admin');

function initFirebase() {
    const serviceAccount = require("../db/key.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
initFirebase();
function sendPushToOneUser(notification) {
    const message = {
        token: notification.tokenId,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    sendMessage(message);
}

function sendPushToTopic(notification) {
    const message = {
        topic: notification.topic,
        data: {
            titulo: notification.titulo,
            mensaje: notification.mensaje
        }
    }
    SendMessageTopic(message);
}

function registertoTopic(tokens,topic){
    RegisterTopic(tokens,topic);
}
function unRegisterTopic(tokens,topic){
    DeleteTopic(tokens,topic);
}
module.exports = { sendPushToOneUser, sendPushToTopic,registertoTopic,unRegisterTopic }

function sendMessage(message) {
    var payload = {
        notification: {
          title: message.data.titulo,
          body: message.data.mensaje,
        },
        data:{
         //Datos adicionales
        }
      };

      admin.messaging().sendToDevice(message.token, payload).then(response=>{
        response.results.forEach((result, index) => {
         const error = result.error;
         if (error) {
           console.error('Failure sending notification to', token, error);
         } else{
           console.log('Sucessfully sent to '+token);
         }
       });
    })
}

function SendMessageTopic(message){

    var payload = {
        notification: {
          title: message.data.titulo,
          body: message.data.mensaje,
        },
        data:{
         //Datos adicionales
        }
    }
    
    admin.messaging().sendToTopic(message.topic, payload)
              .then(function(response) {
                console.log("Successfully sent message:", response);
              })
              .catch(function(error) {
                console.log("Error sending message:", error);
              });
}  
function RegisterTopic(tokens,topic){
    var a = tokens;
    a = a.replace(/'/g, '"');
    a = JSON.parse(a);
    admin.messaging().subscribeToTopic(a,"/topics/"+topic)
    .then(function(response) {
      console.log("Finaliza registro:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}
function DeleteTopic(tokens,topic){
    var a = tokens;
    a = a.replace(/'/g, '"');
    a = JSON.parse(a);
    admin.messaging().unsubscribeFromTopic(a,"/topics/"+topic)
    .then(function(response) {
      console.log("Finaliza registro de eliminación:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
    });
}
