const router = global.router;
const getContent = require("../server/get_content")
const sqlQuery = require("../public/sqlQueryBook");
const {cerateCode, selectCode} = require("../sql/sqlList");
const {createCodeNum} = require("../public/method");
// 查询卡号
router.get('/selectCode', async (ctx) => {
    let data = await sqlQuery(selectCode);
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    ctx.body = {
        state: 200,
        data: data
    }
});
// 创建卡号
router.get('/createCode', async (ctx) => {
    let {num = 10, orgin = 1} = ctx.query;
    let sqlInfo = [];
    for (let i = 0; i < num; i++) {
        sqlInfo.push([createCodeNum(), orgin])
    }
    let data = await sqlQuery(cerateCode, [sqlInfo]);
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    ctx.body = {
        state: 200,
        data: 'ok'
    }
});
router.post('/selectContentInfo', async (ctx) => {
    let {url} = ctx.request.body;
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    if (url) {
        let data = await getContent(url)
        ctx.body = {
            state: 200,
            data: data
        }
    } else {
        ctx.body = {
            state: 100,
            data: null
        }
    }
});
