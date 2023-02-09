

const colors = require('colors');

const ProgressBar = require('../../lib/ProgressBar');
const Timer = require('../../lib/Timer');

const Dest = require('./Target/Dest');
const File = require('./Target/File');

module.exports = {

    parse({ target, files, file$md5, md5$main, file$exif, }) {
        let { dir, overwrite, } = target;
        
        if (!dir) {
            return;
        }
        

        let list = files.map((file) => {
            let md5 = file$md5[file];
            let main = md5$main[md5];
            let exif = file$exif[file];
            let samples = file == main ? target.main : target.repeat;
            let { dest, sample, date, year, month, day, ext, type, name, basename, } = Dest.get({ dir, file, exif, samples, });

            return {
                dir, overwrite, file, md5, exif,
                dest, sample, date, year, month, day, ext, type, name, basename, 
            };

        });

        return list;

    },


    copy(console, list, process) { 
        let bar = new ProgressBar(list, console);
        let timer = new Timer(console);
        let maxIndex = list.length - 1;

        timer.start(`开始拷贝文件: 共 ${colors.cyan(list.length)} 个 >>`.bold);

        list.forEach((item, index) => {
            let { file, dest, overwrite, } = item;
            let link = index == maxIndex ? `└──` : `├──`;
            let msgs = [];

            dest = process(item);

            if (dest) {
                msgs = File.copy({ file, dest, overwrite, link, });
            }
            else {
                msgs = [`${link}${'已忽略'.bgMagenta}: ${file.magenta}`,];
            }
          

            bar.render({
                'msg': msgs.join('\n'),
                'text': '拷贝: ',
            });

        });

        timer.stop(`<< 结束拷贝文件，耗时: {text}。`.bold);

    },


};