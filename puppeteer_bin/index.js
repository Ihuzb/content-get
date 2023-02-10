const initPuppeteerPool = require('../config/puppeteer_pool');
const login = require('../server/login')
const pool = initPuppeteerPool({ // 全局只应该被初始化一次
    puppeteerArgs: {
        ignoreHTTPSErrors: true,
        headless: true,
        args: [
            '-–disable-dev-shm-usage',
            '-–disable-setuid-sandbox',
            '-–no-first-run',
            '--no-sandbox',
            '-–no-zygote',
            '-–single-process',
            // `--proxy-server=${proxyUrl}`
        ],
        //pipe: true, // 不使用 websocket
    }
});
module.exports = async () => {
    return await login(pool);
}
