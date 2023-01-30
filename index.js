const showImg = require('./public/black_white');
const resemble = require("resemblejs");
const images = require('images')
const fs = require('fs');
const gm = require('gm');
const {createCanvas, loadImage} = require('canvas')

let path = './image/iimageeee.jpg'
let bgPath = './bgimg.jpg'
const image = images(path);
let size = Object.values(image.size());
const canvas = createCanvas(...size)
const ctx = canvas.getContext('2d')

gm(path)
    .colorspace('GRAY')
    .blur(1,5)
    .write(bgPath, function (err) {
        console.log(err, 34)
        if (!err) console.log("done");
        resemble(path)
            .compareTo(bgPath)
            .ignoreColors()
            .onComplete(async function (data) {
                fs.writeFileSync('./aaa.jpg', data.getBuffer());
            });

        loadImage(bgPath).then(image => {
            ctx.drawImage(image, 0, 0, ...size)
            let imgDataInfo = ctx.getImageData(0, 0, ...size)
            let imgData = showImg(imgDataInfo);
            ctx.putImageData(imgData, 0, 0);
            const buffer = canvas.toBuffer('image/jpeg')
            fs.writeFileSync('./test.jpg', buffer)
        })
    });


// console.log(buffer, new Uint8ClampedArray(buffer), 123)
// let threshold = {data: new Uint8ClampedArray(buffer), ...size}
// let imgData = showImg(threshold);
// console.log(Buffer.from(imgData.data, 'base64'), 222)
// images(new Buffer.from(imgData.data)).save("out.jpg")
