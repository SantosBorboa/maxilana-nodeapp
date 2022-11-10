const mysql = require('mysql');
const libsodium = require('../webapi/libsodium/libsodium.js');
const { configMaxilanaDB } = require('../db/config');
 
const SaveStorage = (data) => {
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection(configMaxilanaDB);
        con.connect((conerror) => {
            if (conerror) return reject(conerror);
            const query = `insert into apidatastorage (data) values (?)`;
            libsodium.encriptar(data).then((dataEncoded) => {
                con.query(query, [data], (err, result, fields) => {
                    if (err) return reject(err);
                    con.end(errorEnd => {
                        if (errorEnd) return reject(errorEnd);
                        resolve(result.insertId);
                    });
                });
            }).catch(error => {
                console.log(error);
                return reject(error);
            });
        });
    });
};
const DeleteStorage = (id) => {
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection(configMaxilanaDB);
        con.connect((conerror) => {
            if (conerror) return reject(conerror);
            const query = `delete from apidatastorage where id = ?`;
            con.query(query, [id], (err, result, fields) => {
                if (err) return reject(err);
                con.end(errorEnd => {
                    if (errorEnd) return reject(errorEnd);
                    resolve(result.affectedRows);
                });
            });
        });
    });
};
const GetDataStorage = (id) => {
    return new Promise((resolve, reject) => {
        const con = mysql.createConnection(configMaxilanaDB);
        con.connect((conerror) => {
            if (conerror) return reject(conerror);
            const query = `select * from apidatastorage where id = ?`;
            con.query(query, [id], (err, result, fields) => {
                if (err) return reject(err);
                con.end(errorEnd => {
                    if (errorEnd) return reject(errorEnd);
                    resolve(result[0]); 
                });
            });
        });
    });
};

module.exports = {
    SaveStorage,
    DeleteStorage,
    GetDataStorage,
}