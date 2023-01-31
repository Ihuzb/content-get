const {urlList, userInfo} = require("../config/config");
const {delay} = require("../public/method");
const p_code = require("../server/p_code");

async function btnSlider(page, distance, box, axleX, axleY) {
    await page.mouse.move(axleX, axleY);
    await page.mouse.down();
    await delay(400);
    await page.mouse.move(box.x + distance / 2, axleY, {steps: 15});
    await delay(100);
    await page.mouse.move(box.x + distance + 40, axleY, {steps: 15});
    await delay(500);
    await page.mouse.move(box.x + distance + 30, axleY, {steps: 10});
    await delay(200);
    await page.mouse.up();
    await delay(1000);
}

module.exports = async (pool) => {
    await pool.use(async (browser) => {
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({
            'Accept-Encoding': 'gzip'
        });
        // await page.authenticate(agencyIp);
        // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36')
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            })
        });
        const status = await page.goto(urlList.main_url, {
            'timeout': 1000 * 100 //这里超时是60s
        });
        if (!status.ok) {
            throw new Error('cannot open google.com')
        }
        await page.waitForSelector(".SignFlow-tabs");
        // 获取密码登录元素
        let password_ele = await page.$('.SignFlow-tabs .SignFlow-tab:nth-child(2)');
        // 点击密码登录元素
        await password_ele.click();
        await delay();
        // 获取用户名输入框并输入
        await page.type('.SignFlow-account input[name="username"]', userInfo.username);
        // await page.$eval('.SignFlow-account input[name="username"]', (el, value) => el.value = value.username, userInfo);
        // 获取密码输入框并输入
        await page.type('.SignFlow-password input[name="password"]', userInfo.password);
        // await page.$eval('.SignFlow-password input[name="password"]', (el, value) => el.value = value.password, userInfo);
        await delay();
        // 获取密码登录元素
        let submit_ele = await page.$('.Button.SignFlow-submitButton');
        // 点击登录按钮元素
        await submit_ele.click();
        // 获取拼图区块位置 耗时...
        let location = await p_code(page);
        if (location) {
            // 获取拖动框位置
            const button = await page.$(".yidun_control .yidun_slider");
            const box = await button.boundingBox();
            const axleX = Math.floor(box.x + box.width / 2);
            const axleY = Math.floor(box.y + box.height / 2);
            let {left} = location
            // 模拟鼠标移动
            await btnSlider(page, left, box, axleX, axleY);
        } else {
            console.log('识别失败，登陆失败！！')
        }
        global.browser = browser;
    });
}