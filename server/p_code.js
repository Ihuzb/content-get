const {delay} = require("../public/method");
const {myGet} = require("../api/api");
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const accessToken = require("./access_token");
const pImage = require("./p_image");
module.exports = async (page) => {
    await delay(4000);
    // 获取拼图验证码地址
    const file = await page.$eval(".yidun_bgimg .yidun_bg-img", img => img.src);
    if (!file) return null;
    // 请求图片地址并转换base64
    const res = await myGet(file, {}, {
        responseType: 'arraybuffer', // 特别注意，需要加上此参数
    });
    const base64Str = res.data.toString('base64');
    const access_token = await accessToken();
    const p_info = await pImage(access_token, base64Str);
    let results = p_info.results;
    console.log('解析成功！！')
    if (results && results.length) {
        let location = results[0].location;
        return location;
    } else {
        return null;
    }
}