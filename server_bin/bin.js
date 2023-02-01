const puppeteerBin = require("../puppeteer_bin/index");
const koaServer = require("./index")
const Async = require("async");
let repeatNum = 20;
const retry = (retries, fn) => {
    fn().then(res => true).catch((err) => retries > 1 ? retry(retries - 1, fn) : false);
};
Async.auto({
    koa: function (callback) {
        koaServer()
        callback(null, true);
    },
    puppeteer: function (callback) {
        puppeteerBin().then(res => {
            callback(null, res);
        }).catch(err => {
            callback(null, err);
        })
    },
    time: function () {

    },
    repeat: ['puppeteer', function (results, callback) {
        if (!results.puppeteer) {
            console.log(`${results.puppeteer == 0 ? '登录' : '识别'}失败`);
            console.log('开始重试！！');
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