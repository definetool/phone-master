
const colors = require('colors');
const MD5 = require('@definejs/md5');
const $Array = require('@definejs/array');

const ProgressBar = require('../../lib/ProgressBar');
const Timer = require('../../lib/Timer');



module.exports = {

    parse(console, files) {
        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);

        let file$md5 = {};
        let md5$files = {};

        //一个 md5 对应多个文件时，找出一个主文件。 
        //必须要有一个主文件，尽量找到不带 `(n)` 这种模式的文件名。
        let md5$main = {}; 
        let maxIndex = files.length - 1;

        timer.start(`开始计算 md5，共: ${colors.cyan(files.length)} 个 >>`.bold);

        files.forEach((file, index) => {
            let md5 = MD5.read(file);
            let main = md5$main[md5];
            let isCopy = file.includes('(') && file.includes(')'); //如 `IMG_9727 (1).JPG`。

            let link = index == maxIndex ? `└──` : `├──`;

            md5$main[md5] = !isCopy ? file : main || file;
            file$md5[file] = md5;
            $Array.add(md5$files, md5, file);

            bar.render({
                'text': '计算 md5: ',
                'msg': `${link}${md5}:${file.cyan}`,
            });

            
            
        });

        timer.stop(`<< 结束计算 md5，耗时: {text}。`.bold);

        let mains = Object.values(md5$main);

        return {
            file$md5,
            md5$files,
            md5$main,
            mains,
        };
    },



};