const router = global.router;
const getContent = require("../server/get_content")
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
