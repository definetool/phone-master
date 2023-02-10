
const Path = require('@definejs/path');


module.exports = {
    create(config) { 
        let { output, source, target, } = config;

        source.dir = Path.normalizeDir(source.dir);


        if (target.dir) {
            target.dir = Path.normalizeDir(target.dir);
        }

        if (output.dir) {
            output.dir = Path.normalizeDir(output.dir);
            output.console = Path.normalize(`${output.dir}${output.console}`);
            output.info = Path.normalize(`${output.dir}${output.info}`);
        }
        

        let meta = {
            output,
            source,
            target,


            console: null,
            timer: null,

            //解析后得到的结果。
            info: {
                files: [],      //source 目录扫描出来的符合条件的文件列表。

                file$md5: {},   //
                md5$files: {},  //
                md5$main: {},   //
                mains: [],      //

                exifs: [],  //
                file$exif: {},  //提取 exif 信息后的结果。

                tasks: [],      //需要处理的列表，item = { file, dest, };
            },


        };

        return meta;
    },
};