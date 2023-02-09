

const colors = require('colors');
const Patterns = require('@definejs/patterns');

const Timer = require('../../lib/Timer');

module.exports = {

    scan(console, source) {
        let { dir, patterns, excludes, exifs, } = source;
        let timer = new Timer(console);

        timer.start(`${'开始扫描目录'.bold} ${dir.blue} >>`.bold);


        let files = Patterns.getFiles(dir, patterns, excludes);

        //过滤出能提取 exif 信息的文件。
        exifs = files.filter((file) => {
            //全部转成大写。
            file = file.toUpperCase();

            return exifs.some((ext) => {
                //全部转成大写。
                ext = ext.toUpperCase();

                return file.endsWith(ext);
            });
        });
      

        timer.stop(`<< 结束扫描，共找到 ${colors.cyan(files.length)} 个文件，耗时{text}。`.bold);

        return { files, exifs, };
    },

};