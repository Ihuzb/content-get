const router = global.router;
const getContent = require("../server/get_content")
const sqlQuery = require("../public/sqlQueryBook");
const {cerateCode, selectCode, setCodeType, selectCodeInfo, setUseCodeType} = require("../sql/sqlList");
const {createCodeNum} = require("../public/method");
const Async = require('async');
// 批量修改卡号状态
router.post('/setCodeTypeAll', async (ctx) => {
    let {code} = ctx.request.body;
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    if (code.length) {
        await (() => {
            return new Promise((re, rj) => {
                Async.mapLimit(code, 5, async (item) => {
                    let codeInfo = await sqlQuery(setCodeType, [2, item]);
                    return true;
                }, (err, con) => {
                    re();
                })
            })
        })();
        ctx.body = {
            state: 200,
            data: 'ok'
        }
    } else {
        ctx.body = {
            state: 200,
            data: null
        }
    }
});

// 生成文档链接/修改卡号状态
router.get('/setCodeType', async (ctx) => {
    let {type = 2, id} = ctx.query;
    if (!id) {
        ctx.body = {
            state: 200,
            data: 'id为空'
        }
    }
    await sqlQuery(setCodeType, [type, id]);
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    ctx.body = {
        state: 200,
        data: 'ok'
    }
});
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
    await sqlQuery(cerateCode, [sqlInfo]);
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    ctx.body = {
        state: 200,
        data: 'ok'
    }
});
// 查询内容
router.post('/selectContentInfo', async (ctx) => {
    let {url, code} = ctx.request.body;
    ctx.set("Content-Type", "application/json")
    ctx.type = 'json'
    if (url && code) {
        let codeInfo = await sqlQuery(selectCodeInfo, [code]);
        if (codeInfo.length) {
            let {type, orgin} = codeInfo[0];
            if (type == 2) {
                let data = await getContent(url);
                if (orgin == 1) {// 次卡
                    await sqlQuery(setUseCodeType, [3, code]);
                } else if (orgin == 2) {// 月卡
                    await sqlQuery(setUseCodeType, [3, code]);
                }
                ctx.body = {
                    state: 200,
                    data: data
                }
            } else {
                ctx.body = {
                    state: 200,
                    data: type
                }
            }
        } else {
            ctx.body = {
                state: 200,
                data: null
            }
        }
    } else {
        ctx.body = {
            state: 100,
            data: null
        }
    }
});
