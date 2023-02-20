
const Path = require('@definejs/path');


module.exports = {
    create(config, defaults) { 
        //重载 create(dir, defaults);
        if (typeof config == 'string') {
            let dir = config;

            config = {
                output: `${dir}/output/`,
                source: `${dir}/source/`,
                target: `${dir}/target/`,
            };
        }

       
        let { output, source, target, } = config;

        if (typeof output == 'string') {
            output = { 'dir': output, };
        }

        if (typeof source == 'string') {
            source = { 'dir': source, };
        }

        if (typeof target == 'string') {
            target = { 'dir': target, };
        }


        output = { ...defaults.output, ...output, };
        source = { ...defaults.source, ...source, };
        target = { ...defaults.target, ...target, };

        config = { ...defaults, ...config, output, source, target, };

        if (output.dir) {
            output.dir = Path.resolve(output.dir);
            output.dir = Path.normalizeDir(output.dir);
            output.console = Path.normalize(`${output.dir}${output.console}`);
        }

        source.dir = Path.resolve(source.dir);
        source.dir = Path.normalizeDir(source.dir);

        if (target.dir) {
            target.dir = Path.resolve(target.dir);
            target.dir = Path.normalizeDir(target.dir);
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