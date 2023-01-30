module.exports = (imgData) => {
    let index = OTSUAlgorithm(imgData);//阈值
    for (let i = 0; i < imgData.data.length; i += 4) {
        let R = imgData.data[i]; //R(0-255)
        let G = imgData.data[i + 1]; //G(0-255)
        let B = imgData.data[i + 2]; //B(0-255)
        let Alpha = imgData.data[i + 3]; //Alpha(0-255)
        let sum = (R + G + B) / 3;
        if (sum > index) {
            imgData.data[i] = 255;
            imgData.data[i + 1] = 255;
            imgData.data[i + 2] = 255;
            imgData.data[i + 3] = Alpha;
        } else {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = Alpha;
        }
    }
    return imgData;
}

//一维OTSU图像处理算法
function OTSUAlgorithm(canvasData) {
    let m_pFstdHistogram = new Array();//表示灰度值的分布点概率
    let m_pFGrayAccu = new Array();//其中每一个值等于m_pFstdHistogram中从0到当前下标值的和
    let m_pFGrayAve = new Array();//其中每一值等于m_pFstdHistogram中从0到当前指定下标值*对应的下标之和
    let m_pAverage = 0;//值为m_pFstdHistogram【256】中每一点的分布概率*当前下标之和
    let m_pHistogram = new Array();//灰度直方图
    let i, j;
    let temp = 0, fMax = 0;//定义一个临时变量和一个最大类间方差的值
    let nThresh = 0;//最优阀值
    //初始化各项参数
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = 0;
        m_pFGrayAccu[i] = 0;
        m_pFGrayAve[i] = 0;
        m_pHistogram[i] = 0;
    }
    //获取图像的像素
    let pixels = canvasData.data;
    //下面统计图像的灰度分布信息
    for (i = 0; i < pixels.length; i += 4) {
        //获取r的像素值，因为灰度图像，r=g=b，所以取第一个即可
        let r = pixels[i];
        m_pHistogram[r]++;
    }
    //下面计算每一个灰度点在图像中出现的概率
    let size = canvasData.width * canvasData.height;
    for (i = 0; i < 256; i++) {
        m_pFstdHistogram[i] = m_pHistogram[i] / size;
    }
    //下面开始计算m_pFGrayAccu和m_pFGrayAve和m_pAverage的值
    for (i = 0; i < 256; i++) {
        for (j = 0; j <= i; j++) {
            //计算m_pFGaryAccu[256]
            m_pFGrayAccu[i] += m_pFstdHistogram[j];
            //计算m_pFGrayAve[256]
            m_pFGrayAve[i] += j * m_pFstdHistogram[j];
        }
        //计算平均值
        m_pAverage += i * m_pFstdHistogram[i];
    }
    //下面开始就算OSTU的值，从0-255个值中分别计算ostu并寻找出最大值作为分割阀值
    for (i = 0; i < 256; i++) {
        temp = (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])
            * (m_pAverage * m_pFGrayAccu[i] - m_pFGrayAve[i])
            / (m_pFGrayAccu[i] * (1 - m_pFGrayAccu[i]));
        if (temp > fMax) {
            fMax = temp;
            nThresh = i;
        }
    }
    return nThresh
}