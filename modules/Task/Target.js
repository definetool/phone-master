

const colors = require('colors');
const Path = require('@definejs/path');

const ProgressBar = require('../../lib/ProgressBar');
const Timer = require('../../lib/Timer');

const Dest = require('./Target/Dest');
const File = require('./Target/File');

module.exports = exports = {

    parse({ target, files, file$md5, md5$main, file$exif, }) {
        let { dir, overwrite, } = target;
        
        if (!dir) {
            return;
        }
        

        let list = files.map((file) => {
            //当不启用 Exif 分析时，file$exif 就为一个空对象 {}。
            //当不启用 MD5 分析时，file$md5、md5$main 就为一个空对象 {}。
            //当 file == main 时则为主文件，否则为重复文件。
            
            let md5 = file$md5[file];   //可能不存在。
            let main = md5 === undefined ? file : md5$main[md5];

            let exif = file$exif[file]; //可能不存在。
            let samples = file == main ? target.main : target.repeat;

            let { dest, sample, date, year, month, day, ext, type, name, basename, } = Dest.get({ dir, file, exif, samples, });

            return {
                dir, overwrite, file, md5, main, exif,
                dest, sample, date, year, month, day, ext, type, name, basename, 
            };

        });

        return list;

    },


    each(console, list, { action, fnDest, fnProcess, }) {
        let bar = new ProgressBar(list, console);
        let timer = new Timer(console);
        let maxIndex = list.length - 1;

        timer.start(`开始${action}文件: 共 ${colors.cyan(list.length)} 个 >>`.bold);

        list.forEach((item, index) => {
            let { file, dest, overwrite, } = item;
            let link = index == maxIndex ? `└──` : `├──`;
            let values = fnDest(item, index);
            let msgs = [];

            dest = Dest.check(item, values);

            if (dest) {
                dest = Path.normalize(dest);
                msgs = File.each({ file, dest, overwrite, link, }, function () { 
                    fnProcess(file, dest, item, index);
                });
            }
            else {
                msgs = [`${link}${'已忽略'.bgMagenta}: ${file.magenta}`,];
            }


            bar.render({
                'msg': msgs.join('\n'),
                'text': `${action}: `,
            });

        });

        timer.stop(`<< 结束${action}文件，耗时: {text}。`.bold);

    },



};