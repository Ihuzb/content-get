const mysql = require('../public/sqlOption');
module.exports = (sql, data = '') => {
    return new Promise((re, rj) => {
        mysql.selectInfo(sql, data).then(res => {
            re(res)
        }).catch(err => {
            rj(res)
        });
    })
}