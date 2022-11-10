const _sodium = require('../../node_modules/libsodium-wrappers');
let desencriptar =  async function desencriptar(dato){
  return new Promise(function(resolve,reject){
      _sodium.ready;
      const sodium = _sodium;
      const base64key = 'AOLrBEaSnOAePt72IdESAqqVBY//4qvTO47tYdeVK/k=';
      const buff = Buffer.from(base64key, 'base64');
      const str = buff.toString('hex');
      let key = sodium.from_hex(str);
  
   
      let butt = Buffer.from(dato, 'base64');
      let tjt = butt.toString('hex');
      
      let tarjeta = sodium.from_hex(tjt);
      let ciphertext = tarjeta;
      const nonce = ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
      const encryptedMessage = ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
      let x = sodium.crypto_secretbox_open_easy(encryptedMessage,nonce,key)
      var decodificado = String.fromCharCode.apply(null, x);
  
      resolve(decodificado);
    });
  }

 let encriptar =  async function encriptar(dato){
  return new Promise(function(resolve,reject){
    _sodium.ready;
    const sodium = _sodium;
    const base64key = 'AOLrBEaSnOAePt72IdESAqqVBY//4qvTO47tYdeVK/k=';
    const buff = Buffer.from(base64key, 'base64');
    const str = buff.toString('hex');
    let key = sodium.from_hex(str);

    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    let codificado =  concatenate(nonce, sodium.crypto_secretbox_easy(dato, nonce, key));
    var base64String = Buffer.from(codificado, 'binary').toString('base64');
    resolve(base64String);
  });
  }
  function concatenate(a, b)
  {
    const c = new Uint8Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  module.exports={
    encriptar,
    desencriptar
  }
