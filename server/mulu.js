const async = require("async");
const getContentNew = require("./get_contentNew");
const clickAdd = (page) => {
    return new Promise(async (re, rj) => {
        let addInfo = await page.$("div[class*='CatalogModule-allSection-']");
        if (addInfo) {
            await addInfo.click();
            try {
                await page.waitForResponse(response => {
                    return response.url().includes('/catalog')
                });
                await clickAdd(page);
                re();
            } catch (e) {
                re();
            }
        } else {
            re()
        }
    })
}
module.exports = async (page) => {
    return new Promise(async (re, rj) => {
        await clickAdd(page);
        console.log('目录内容！！');
        let title = await page.$$eval("div[class*='HeaderInfo-title-'] span", async e => {
            let child = e.slice(-1)[0].innerText
            return child;
        })
        let infoList = await page.$$eval("div[class*='ChapterItem-root-']", async e => {
            let infoList = e.map(v => {
                let baseURI = v.baseURI.split('/').slice(-1)[0];
                let id = v.moduleInfo.card.content.id
                return `https://www.zhihu.com/market/paid_column/${baseURI}/section/${id}`
            })
            return infoList
        });
        console.log(`共获取${infoList.length}章，开始获取内容！！`)
        await async.mapLimit(infoList, 10, async (item) => {
            let info = await getContentNew(item);
            return info;
        }, (err, con) => {
            console.log(`共获取${infoList.length}章，实际获取${con.filter(v => v).length}章！！`)
            let text = `<h1>《${title}》</h1><br/>${con.join('<br/>')}`
            re(text)
        })
    })
}