
const colors = require('colors');
const fs = require('fs');
const MD5 = require('@definejs/md5');
const $Array = require('@definejs/array');

const ProgressBar = require('../../../lib/ProgressBar');
const Timer = require('../../../lib/Timer');
const Size = require('../../../lib/Size');

const Main = require('./Hash/Main');



module.exports = {

    parse(console, enabled, files) {
        let file$hash = {};
        let hash$files = {};
        let hash$main = {}; 
        let main$files = {};    //主文件对应的 hash 相同的其它重复文件。
        let mains = [];         //所有的主文件。

        //不启用。
        if (!enabled) {
            return { file$hash, hash$files, hash$main, main$files, mains, };
        }



        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);
        let maxIndex = files.length - 1;

        timer.start(`开始计算哈希: ${colors.cyan(maxIndex + 1)} 个 >>`.bold);

        files.forEach((file, index) => {
            let link = index == maxIndex ? `└──` : `├──`;
            let hash = MD5.read(file);
            let stat = fs.statSync(file);
            let size = Size.getDesc(stat.size);


            $Array.add(hash$files, hash, file);
            file$hash[file] = hash;


            bar.render({
                text: `计算哈希: `,
                msg: `${link.gray}${hash.cyan} ${file.grey} ${'|'.cyan} ${size.value.magenta}${size.desc}`,
            });
            
        });


        Object.entries(hash$files).forEach(([hash, files]) => {
            let main = hash$main[hash] = Main.get(files);
            
            //找出重复的文件。
            files = files.filter((file) => {
                return file != main;
            });

            main$files[main] = files;
            mains.push(main);
        });

        timer.stop(`<< 结束计算 md5，耗时: {text}。`.bold);


        return {
            file$hash,
            hash$files,
            hash$main,
            main$files,
            mains,
        };
    },



};