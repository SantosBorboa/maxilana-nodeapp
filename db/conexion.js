const mysql = require('mysql');
const sql = require("mssql");
let connection = mysql.createPool({
  host            : '198.12.231.45',
  user            : 'maxilanabd',
  password        : 'Cuitlahuac9607',
  database        : 'maxilanabd',
  charset         : 'utf8',
  connectionLimit : 10000,
  timeout : 3000,
}).on('error', function(error){
}).on('connection', function(connection){
  //console.log(connection);
  console.log('Got connection..... %d', connection.threadId)
}).on('release', (connection)=>{
  console.log('Connection %d released', connection.threadId);
});
// let connection  = mysql.createConnection({
//         connectionLimit : 10,
//         host            : '198.12.231.45',
//         user            : 'maxilanabd',
//         password        : 'Cuitlahuac9607',
//         database        : 'maxilanabd',
//         charset         : 'utf8'
// });  

let connectionsubastas = mysql.createPool({
  connectionLimit : 10,
  host            : '174.136.28.68',
  user            : 'erick',
  password        : 'erick2021',
  database        : 'abroadcaster',
  charset         : 'utf8',
  timeout : 1000,
  connectionLimit : 10000,
}).on('error', function(error){
}).on('connection', function(connection){
  //console.log(connection);
  console.log('Got connection.....%d', connection.threadId)
}).on('release', (connection)=>{
  console.log('Connection %d released', connection.threadId);
});

// let connectionsubastas  = mysql.createConnection({
//   connectionLimit : 10,
//   host            : '174.136.28.68',
//   user            : 'erick',
//   password        : 'erick2021',
//   database        : 'abroadcaster',
//   charset         : 'utf8'
// });
let sqlconnection = new sql.ConnectionPool({
  user: 'sa',
  password: 'napire960702',
  server: '10.0.0.232', 
  database: 'Subastas' 
});
module.exports = {
 connection,
 sqlconnection,
 connectionsubastas
}