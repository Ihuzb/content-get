const puppeteerBin = require("../puppeteer_bin/index");
const setEndTime = require("../server/setEndTime");
const koaServer = require("./index")
const Async = require("async");
let repeatNum = 5;
const retry = (retries, fn) => {
    return new Promise((re, rj) => {
        fn().then(res => {
            re(true)
        }).catch(async (err) => {
            rj(retries > 1 ? await retry(retries - 1, fn) : false)
        });
    })
};
Async.auto({
    setEndTime: async () => {
        await setEndTime();
        console.log('开始月卡定时任务！！');
        return true
    },
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
    repeat: ['puppeteer', async (results) => {
        // callback(null, results.puppeteer == 1);
        if (results.puppeteer != 1) {
            console.log(`${results.puppeteer == 0 ? '登录' : '识别'}失败`);
            console.log('开始重试启动爬虫服务...');
            await retry(repeatNum, puppeteerBin).then(res => {
                return res
            }).catch(err => {
                return false;
            })
        } else {
            return true;
        }
    }]
}, function (err, results) {
    if (results.repeat) {
        console.log('登录成功！！')
    } else {
        console.log('登录失败！！')
    }
})