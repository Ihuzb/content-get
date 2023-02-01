const {myGet} = require("../api/api");
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const accessToken = require("./access_token");
const {baiduCode, yingCode} = require("./p_image");
const {filterCode} = require("../public/method")
module.exports = async (page) => {
    await page.waitForTimeout(4000);
    // 获取拼图验证码地址
    const file = await page.$eval(".yidun_bgimg .yidun_bg-img", img => img.src);
    // 获取当前验证码类型
    const typeText = await page.$eval(".yidun_tips__content .yidun_tips__text.yidun-fallback__tip", e => e.innerText);
    const codetype = typeText && filterCode(typeText) || null;
    if (!file || !codetype) return null;
    // 请求图片地址并转换base64
    const res = await myGet(file, {}, {
        responseType: 'arraybuffer', // 特别注意，需要加上此参数
    });
    const file_base64 = res.data.toString('base64');
    console.log('验证码类型：', codetype);
    if (codetype == 9101) {
        const access_token = await accessToken();
        const p_info = await baiduCode(access_token, file_base64);
        let results = p_info.results;
        if (results && results.length) {
            console.log('解析成功！！', codetype)
            let location = results[0].location;
            return {loca: location.left, codetype}
        } else {
            return null;
        }
    } else if (codetype == 9103) {
        // const p_info = await yingCode({
        //     user: "ihuzbb",
        //     pass: "hzb136877",
        //     softid: 944501,
        //     codetype,
        //     file_base64
        // });
        // console.log(p_info, 77777)
        // if (p_info.err_no == 0) {
        //     console.log('解析成功！！', codetype)
        //     return {loca: p_info.pic_str.split('|').map(v => v.split(',')), codetype}
        // } else {
        //     return null;
        // }
        return null;
    }
}