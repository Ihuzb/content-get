const {myGet} = require("../api/api");
const {baiduClient} = require("../config/config");

module.exports = async () => {
    let res = await myGet("https://aip.baidubce.com/oauth/2.0/token", {
        grant_type: 'client_credentials',
        client_id: baiduClient.client_id,
        client_secret: baiduClient.client_secret
    })
    return res.data.access_token
}