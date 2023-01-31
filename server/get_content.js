const {delay} = require("../public/method");
const puppeteer = require('puppeteer');

module.exports = async (url) => {
    let browser = global.browser;
    if (!browser) return null;
    console.log(url, 'url')
    await delay(2000);
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'Accept-Encoding': 'gzip'
    });
    const status = await page.goto(url, {
        'timeout': 1000 * 100 //这里超时是60s
    });
    if (!status.ok) {
        throw new Error('cannot open google.com')
    }
    const text = await page.evaluate(() => {
        return document.querySelector("#manuscript").innerText;
    });
    await delay(3000);
    page.close();
    return text;
}