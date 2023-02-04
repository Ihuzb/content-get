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
    },
    // 生成随机码
    createCodeNum: (min = 10, max = 10) => {
        let str = "",
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // 随机产生
        range = Math.round(Math.random() * (max - min)) + min;
        for (let i = 0; i < range; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }

}