const puppeteerBin = require("../puppeteer_bin/index");
const koaServer = require("./index")
const Async = require("async");
let repeatNum = 5;
const retry = (retries, fn) => {
    fn().then(res => true).catch((err) => retries > 1 ? retry(retries - 1, fn) : false);
};
Async.auto({
    koa: async () => {
        await koaServer();
        console.log('数据库,接口服务启动成功！！');
        return true;
    },
    puppeteer: function (callback) {
        console.log('开始启动爬虫服务...');
        // callback(null, 1);
        puppeteerBin().then(res => {
            console.log('爬虫服务启动成功！！');
            callback(null, res);
        }).catch(err => {
            console.log('爬虫服务启动失败！！');
            callback(null, err);
        })
    },
    repeat: ['puppeteer', function (results, callback) {
        callback(null, results.puppeteer == 1);
        // if (!results.puppeteer) {
        //     console.log(`${results.puppeteer == 0 ? '登录' : '识别'}失败`);
        //     console.log('开始重试启动爬虫服务...');
        //     let type = retry(repeatNum, puppeteerBin);
        //     callback(null, type);
        // } else {
        //     callback(null, true);
        // }
    }]
}, function (err, results) {
    if (results.repeat) {
        console.log('登录成功！！')
    } else {
        console.log('登录失败！！')
    }
})