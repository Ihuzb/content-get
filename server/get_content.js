const {filterUrl} = require("../public/method")

module.exports = async (url) => {
    let browser = global.browser;
    if (!browser) {
        console.log('浏览器框架失效！！');
        return null;
    }
    console.log(url, 'url')
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Encoding': 'gzip'
    });
    const status = await page.goto(url, {
        waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
        'timeout': 1000 * 100 //这里超时是60s
    });
    if (!status.ok) {
        throw new Error('cannot open google.com')
    }
    await page.waitForTimeout(1000);
    // await page.waitForSelector(".Image-module-image-uorig");
    // const appHeader = await page.$(".Image-module-image-uorig");
    let text = '', login = await page.$('.Modal-inner');
    if (true && !login) {
        console.log('会员状态正常！！');
        await page.exposeFunction("filterUrl", filterUrl);
        text = await page.evaluate(async (url) => {
            let type = await filterUrl(url);
            if (type == 1) {
                console.log('专栏内容！！');
                return `<h1>${document.querySelector("#app h1").innerHTML}</h1>` + '<br/>' + document.querySelector("#manuscript").innerHTML;
            } else if (type == 2) {
                console.log('盐选专栏内容！！');
                return `<h1>${document.querySelector(".Post-Title").innerHTML}</h1>` + '<br/>' + document.querySelector(".RichText.ztext.Post-RichText").innerHTML;
            }
        }, url);

    } else if (login) {
        console.log("会员状态失败！！");
    }
    console.log('请求完成！！');
    page.close();
    return text;
}