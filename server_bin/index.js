const Router = require('koa-router');
const Koa = require('koa');
const KoaBody = require("koa-body")
const cors = require("@koa/cors")
const fs = require("fs");
const path = require("path");
const morgan = require("koa-morgan");
const puppeteerBin = require("../puppeteer_bin/index");

const ENV = process.env.NODE_ENV;
const app = new Koa();
global.router = new Router();
app.use(KoaBody({
    multipart: true
}))
app.use(cors())
require('./server');
// 登录鉴权
if (ENV !== "production") {
    // 开发环境
    app.use(morgan("dev"));
} else {
    // 生产环境
    const logFileName = path.join(__dirname, "logs", "access.log");
    const writeStream = fs.createWriteStream(logFileName, {
        flags: "a",
    });
    app.use(
        morgan("combined", {
            stream: writeStream,
        })
    );
}
module.exports = () => {
    app.use(global.router.routes());
    app.listen(3002);
    Promise.resolve();
}

