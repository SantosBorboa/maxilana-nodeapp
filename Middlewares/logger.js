const fs = require('fs');
const path = require('path');

const Logger = (prefijo, proceso, error) => {
    const date = new Date()
    const fileName = `../Logs/${prefijo}${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${date.getHours()}.log`
    const pathFile = path.join(__dirname, fileName)
    const o = {
        proceso,
        hora: date.toLocaleTimeString(),
        data: JSON.stringify(error),
    };
    fs.appendFile(pathFile, `${JSON.stringify(o)}\n`, (error) => {
        if (error) { console.log(error) }
    });
}

module.exports = Logger