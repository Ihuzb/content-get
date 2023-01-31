module.exports = {
    //并发数
    maxParallel: 1,
    //关闭页面等待时间
    waitTime: 1500,
    //各页面url
    urlList: {
        main_url: "https://www.zhihu.com/",
    },
    // 百度鉴权信息
    baiduClient:{
        client_id: 'ofR2bOKv8vHTyp6qv53C8kHE',
        client_secret: 'NuMt5rYLZmanI9z69k5HndTPbQ7UPIKY'
    },
    // 知乎用户信息
    userInfo: {
        username: '13335103325',
        password: 'z425353361'
    },
    //阿布云
    proxyUrl: 'http://http-dyn.abuyun.com:9020',
    //阿布云配置
    abuyunConfig: {
        username: 'HG032TBT3408Q2VD',
        password: 'CC4B79E1D157AE6C'
    }

}