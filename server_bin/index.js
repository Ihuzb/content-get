const Router = require('koa-router');
const Koa = require('koa');
const KoaBody = require("koa-body")
const cors = require("@koa/cors")

const app = new Koa();
global.router = new Router();
app.use(KoaBody({
    multipart: true
}))
app.use(cors())
require('./server');
module.exports = async () => {
    await app.use(global.router.routes());
    await app.listen(3002);
}

