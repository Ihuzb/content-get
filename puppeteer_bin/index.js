const login = require('../server/login')
module.exports = async (pool) => {
    return await login(pool);
}
