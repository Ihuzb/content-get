const mysql = require("mysql");
let onelib ={
    host: '101.43.109.118',
    user: 'root',
    password: '@Zz425353361',
    port: 3306,
    database: 'book_code',
    charset:'Utf8mb4',
    timezone:"SYSTEM",
    useConnectionPooling: true,
    connectionLimit: 20,
    multipleStatements: true
}
let onelib_pool = mysql.createPool(onelib);
class connectMysql {
    static instance = null;

    static getInstance() {//防止重复实例化
        if (!connectMysql.instance) {
            connectMysql.instance = new connectMysql()
        }
        return connectMysql.instance
    }

    constructor() {
        this.connection = null;//防止重复连接
        this.pingInterval = null;//定时器
        this.connect();
        this.pingConnent();
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (!this.connection) {
                onelib_pool.getConnection((err, connection) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.connection = connection;
                        resolve(connection)
                    }
                })
            } else {
                resolve(this.connection)
            }
        })
    }

    selectInfo(sql, value) {
        return new Promise((resolve, reject) => {
            this.connect().then(connection => {
                connection.query(sql, value, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                });
            }).catch(err => {
                reject(err)
            })
        })
    }

    pingConnent() {
        clearInterval(this.pingInterval);
        this.pingInterval = setInterval((() => {
            this.connection.ping((err) => {
                if (err) {
                    console.log('ping error:' + err)
                }
            })
        }).bind(this), 27800)
    }
}
module.exports = connectMysql.getInstance();
