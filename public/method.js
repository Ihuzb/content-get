module.exports = {
    // 区分链接类型
    filterUrl: (url) => {
        // 专栏
        let zhuanLan = new RegExp(/\/section\//);
        let yanXuan = new RegExp(/\/p\//);
        if (zhuanLan.test(url)) {
            return 1
        } else if (yanXuan.test(url)) {
            return 2
        } else {
            return null
        }
    },
    // 区分验证类型
    filterCode: (text) => {
        if (text.indexOf('点击') > -1) {
            return 9103
        } else if (text.indexOf('拖动') > -1) {
            return 9101
        }
    }

}