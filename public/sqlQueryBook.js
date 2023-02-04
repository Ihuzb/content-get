module.exports = async (sql, data = '') => {
    return new Promise((re, rj) => {
        global.sql.query(sql, data, (error, result) => {
            if (!error) {
                re(result)
            } else {
                rj(error)
            }
        });
    })
}