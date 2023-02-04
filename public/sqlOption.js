const mysql = require("mysql");
const connection = mysql.createConnection({
    host: '101.43.103.117',
    user: 'root',
    password: '@Zz425353361',
    port: 3306,
    database: 'book_code',
    charset:'Utf8mb4',
    useConnectionPooling: true,
    timezone:"SYSTEM"
});
global.sql = connection;