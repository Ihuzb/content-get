const {urlList, userInfo} = require("../config/config");
const p_code = require("../server/p_code");

// 拖动
async function btnSlider(page, distance, box, axleX, axleY) {
    await page.mouse.move(axleX, axleY);
    await page.mouse.down();
    await page.waitForTimeout(400);
    await page.mouse.move(box.x + distance / 2, axleY, {steps: 15});
    await page.waitForTimeout(100);
    await page.mouse.move(box.x + distance + 40, axleY, {steps: 15});
    await page.waitForTimeout(500);
    await page.mouse.move(box.x + distance + 30, axleY, {steps: 10});
    await page.waitForTimeout(200);
    await page.mouse.up();
}

// 点击
async function btnClick(page, distance, box) {
    const axleX = Math.floor(box.x + box.width / 2);
    const axleY = Math.floor(box.y + box.height / 2);
    await page.mouse.move(axleX, axleY);
    await distance.forEach(async v => {
        await page.mouse.move(box.x + v[0], box.y + v[1], {steps: 15});
        await page.mouse.down();
        await page.mouse.up();
        await page.waitForTimeout(1000);
    })
}

module.exports = async (pool) => {
    return new Promise(async (re, rj) => {
        let page = global.page;
        if (page) await page.close();
        await pool.use(async (browser) => {
            const page = await browser.newPage();
            await page.setExtraHTTPHeaders({
                'Accept-Encoding': 'gzip'
            });
            // await page.authenticate(agencyIp);
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36')
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
            await page.waitForTimeout(1000);
            // 获取用户名输入框并输入
            await page.type('.SignFlow-account input[name="username"]', userInfo.username);
            // await page.$eval('.SignFlow-account input[name="username"]', (el, value) => el.value = value.username, userInfo);
            // 获取密码输入框并输入
            await page.type('.SignFlow-password input[name="password"]', userInfo.password);
            // await page.$eval('.SignFlow-password input[name="password"]', (el, value) => el.value = value.password, userInfo);
            await page.waitForTimeout(1000);
            // 获取密码登录元素
            let submit_ele = await page.$('.Button.SignFlow-submitButton');
            // 点击登录按钮元素
            await submit_ele.click();
            // 获取拼图区块位置 耗时...
            console.log('解析验证码...')
            let location = await p_code(page);
            if (location) {
                let {codetype, loca} = location;
                if (codetype == 9101) {
                    // 获取拖动框位置
                    const button = await page.$(".yidun_control .yidun_slider");
                    const box = await button.boundingBox();
                    const axleX = Math.floor(box.x + box.width / 2);
                    const axleY = Math.floor(box.y + box.height / 2);
                    // 模拟鼠标移动
                    await btnSlider(page, Number(loca), box, axleX, axleY);
                } else if (codetype == 9103) {
                    // // 获取图片位置
                    // const img = await page.$(".yidun_panel .yidun_bgimg");
                    // const box = await img.boundingBox();
                    // // 模拟鼠标点击
                    // await btnClick(page, loca, box);
                }
                await page.waitForSelector(".AppHeader-profile");
                const appHeader = await page.$(".AppHeader-profile .Avatar.AppHeader-profileAvatar");
                if (appHeader) {
                    // 登录成功
                    re(1);
                } else {
                    // 登录失败
                    rj(0);
                }
            } else {
                // 识别失败
                rj(-1);
            }
            global.browser = browser;
            global.page = page;
        });
    })

}