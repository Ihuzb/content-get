const {myPost} = require("../api/api");
module.exports = async (access_token, image) => {
    let res = await myPost(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/pCode?access_token=${access_token}`, {
        image
    })
    return res.data
}