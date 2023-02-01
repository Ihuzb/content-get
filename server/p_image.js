const {myPost} = require("../api/api");
module.exports = {
    baiduCode: async (access_token, image) => {
        let res = await myPost(`https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/pCode?access_token=${access_token}`, {
            image
        })
        return res.data
    },
    yingCode: async (image) => {
        let res = await myPost('http://upload.chaojiying.net/Upload/Processing.php', image)
        return res.data
    }
}