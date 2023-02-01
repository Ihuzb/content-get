const Router = require('koa-router');
const Koa = require('koa');
const KoaBody = require("koa-body")
const cors = require("@koa/cors")
const fs = require("fs");
const path = require("path");
const morgan = require("koa-morgan");

const ENV = process.env.NODE_ENV;
const app = new Koa();
global.router = new Router();
app.use(KoaBody({
    multipart: true
}))
app.use(cors())
require('./server');
// 登录鉴权

module.exports = () => {
    app.use(global.router.routes());
    app.listen(3002);
    Promise.resolve();
}

