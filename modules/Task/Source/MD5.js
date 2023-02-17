
const colors = require('colors');
const MD5 = require('@definejs/md5');
const $Array = require('@definejs/array');

const ProgressBar = require('../../../lib/ProgressBar');
const Timer = require('../../../lib/Timer');

const Main = require('./MD5/Main');



module.exports = {

    parse(console, enabled, files) {
        let file$md5 = {};
        let md5$files = {};
        let md5$main = {}; 
        let main$files = {};    //主文件对应的 md5 相同的其它重复文件。
        let mains = [];         //所有的主文件。

        //不启用。
        if (!enabled) {
            return { file$md5, md5$files, md5$main, main$files, mains, };
        }



        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);
        let maxIndex = files.length - 1;

        timer.start(`开始计算 md5，共: ${colors.cyan(maxIndex + 1)} 个 >>`.bold);

        files.forEach((file, index) => {
            let link = index == maxIndex ? `└──` : `├──`;
            let md5 = MD5.read(file);

            $Array.add(md5$files, md5, file);
            file$md5[file] = md5;

            bar.render({
                'text': '计算 md5: ',
                'msg': `${link}${md5}:${file.cyan}`,
            });
            
        });


        Object.entries(md5$files).forEach(([md5, files]) => {
            let main = md5$main[md5] = Main.get(files);
            
            //找出重复的文件。
            files = files.filter((file) => {
                return file != main;
            });

            main$files[main] = files;
            mains.push(main);
        });

        timer.stop(`<< 结束计算 md5，耗时: {text}。`.bold);


        return {
            file$md5,
            md5$files,
            md5$main,
            main$files,
            mains,
        };
    },



};