

const colors = require('colors');
const Patterns = require('@definejs/patterns');

const Timer = require('../../lib/Timer');
const Exifs = require('./Source/Exifs');
const Hash = require('./Source/Hash');

module.exports = {

    parse(console, source) {
        let { dir, patterns, exifs, hash, } = source;
        let timer = new Timer(console);

        timer.start(`${'开始扫描目录'.bold} ${dir.blue} >>`.bold);

        let files = Patterns.getFiles(dir, patterns);

        timer.stop(`<< 结束扫描，共找到 ${colors.cyan(files.length)} 个文件，耗时{text}。`.bold);

        
        //exifs 可能被指定为 false，以便进行 Exif 提取禁用。
        //exifs 可能为 [], 以便进行 Exif 提取启用。 
        exifs = Exifs.filter(files, exifs);


        let { file$hash, hash$files, hash$main, main$files, mains, } = Hash.parse(console, hash, files);


        return {
            files, exifs,
            file$hash, hash$files, hash$main, main$files, mains,
        };
    },



};