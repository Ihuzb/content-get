const puppeteerBin = require("../puppeteer_bin/index");
const koaServer = require("./index")
const Async = require("async");
const initPuppeteerPool = require('../config/puppeteer_pool');

let repeatNum = 5;
const retry = (retries, fn) => {
    fn().then(res => true).catch((err) => retries > 1 ? retry(retries - 1, fn) : false);
};
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
Async.auto({
    koa: function (callback) {
        koaServer()
        console.log('接口服务启动成功！！');
        callback(null, true);
    },
    puppeteer: function (callback) {
        console.log('开始启动爬虫服务...');
        puppeteerBin(pool).then(res => {
            console.log('爬虫服务启动成功！！');
            callback(null, res);
        }).catch(err => {
            console.log('爬虫服务启动失败！！');
            callback(null, err);
        })
    },
    repeat: ['puppeteer', function (results, callback) {
        if (!results.puppeteer) {
            console.log(`${results.puppeteer == 0 ? '登录' : '识别'}失败`);
            console.log('开始重试启动爬虫服务...');
            let type = retry(repeatNum, puppeteerBin);
            callback(null, type);
        } else {
            callback(null, true);
        }
    }]
}, function (err, results) {
    if (results.repeat) {
        console.log('登录成功！！')
    } else {
        console.log('登录失败！！')
    }
})