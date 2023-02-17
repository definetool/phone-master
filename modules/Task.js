
require('colors');

const fs = require('fs');

const File = require('@definejs/file');
const Directory = require('@definejs/directory');
const Emitter = require('@definejs/emitter');

const FileTime = require('../lib/FileTime');
const Timer = require('../lib/Timer');

const Source = require('./Task/Source');
const MD5 = require('./Task/MD5');
const Exif = require('./Task/Exif');
const Target = require('./Task/Target');
const Console = require('./Task/Console');
const Meta = require('./Task/Meta');





let mapper = new Map();

class Task {
    /**
    * 构造器。
    * @param {*} config 配置对象。
    * 已重载 Task(dir);
    *   当传入一个字符串时，将作为一个目录对待，此时：
    *   output.dir = `${dir}/output/`;
    *   source.dir = `${dir}/source/`;
    *   target.dir = `${dir}/target/`;
    * 
    * 已重载 Task(config);
    *   config = {
    *       output: {
    *           dir: '',
    *           console: 'console.log',
    *           info: 'info.json',
    *       },
    *       
    *       source: {
    *           dir: '',
    *           patterns: [],
    *           excludes: [],
    *           exifs: [],
    *       },
    * 
    *       target: {
    *           dir: '',
    *           overwrite: false,
    *           main: {
    *               fullExif: '',
    *               noExif: '',
    *           },
    *           repeat: {
    *               fullExif: '',
    *               noExif: '',
    *           },
    *           
    *       },
    *   };
    */
    constructor(config) {
        let meta = Meta.create(config, exports.defaults);
        let console = Console.create(meta.output.console);
        let emitter = new Emitter(this);

        this.console = console;
        meta.console = console;
        meta.emitter = emitter;

        mapper.set(this, meta);
    }

    /**
    * 绑定事件。
    */
    on(...args) {
        let meta = mapper.get(this);
        meta.emitter.on(...args);
    }

    /**
    * 解析源目录的文件，并提取相关信息。
    * @param {function} done 可选，解析完成后要执行的回调函数。
    *   如果不提供此函数，则会在解析完成后触发 (`parse`) 事件。
    */
    parse(done) {
        let meta = mapper.get(this);
        let { console, source, target, output, } = meta;
        let timer = new Timer(console);

        timer.start(`开始分析 >>`.bold);

        let { files, exifs, } = Source.scan(console, source);
        let { file$md5, md5$files, md5$main, main$files, mains, } = MD5.parse(console, files);


        Exif.extract(console, exifs, function (file$exif) {
            let tasks = Target.parse({ target, files, file$md5, md5$main, file$exif, });

            let info = {
                files,
                file$md5,
                md5$files,
                md5$main,
                main$files,
                mains,
                exifs,
                file$exif,
                tasks,      //可能为 undefined。
            };

            Object.assign(meta.info, info);

            timer.stop(`<< 结束分析，耗时: {text}。`.bold);

            if (done) {
                done(output.dir, info);
            }
            else {
                meta.emitter.fire('parse', [output.dir, info]);
            }


        });

    }

    /**
    * 清空 output 目录和 target 目录中所有的子目录和文件。
    */
    clear() {
        let meta = mapper.get(this);
        let { console, output, target, } = meta;

        console.log(`清空目录:`.bgYellow, output.dir.red);
        Directory.clear(output.dir);

        console.log(`清空目录:`.bgYellow, target.dir.red);
        Directory.clear(target.dir);
    }

    /**
    * 迭代处理每个子任务(文件)。
    * @param {string} action 必选，要在进度条中显示的动作文本，如 `拷贝`、`移动`。
    * @param {function} process 可选，针对每个子任务里的文件要进行处理的回调函数。
    *   如果不提供此函数，则会触发 (`each`, `process`) 二级事件。
    */
    each(action, process) {
        let meta = mapper.get(this);
        let { console, info, emitter, } = meta;

        Target.each(console, info.tasks, {
            action,

            fnDest: function (item, index) {
                return emitter.fire('each', 'dest', [item, index]);
            },

            fnProcess: function (file, dest, item, index) {
                if (process) {
                    process(file, dest, item, index);
                }
                else {
                    emitter.fire('each', 'process', [file, dest, item, index]);
                }
            },
        });
    }


    /**
    * 输出(写入)解析到的中间信息到指定目录中。
    * @param {string} dir 要输出的目录。
    *   如果不指定，则输出到 output.dir 中。
    */
    output(dir) {
        let meta = mapper.get(this);
        let { output, info, } = meta;

        dir = dir || output.dir;

        Object.entries(info).forEach(function ([name, json]) {
            File.writeJSON(`${dir}/${name}.json`, json);
        });
    }

    /**
    * 使用复制(拷贝)的方式处理每个文件。
    * 会把原文件的时间属性也拷贝到目标文件。
    */
    copy() {
        this.each('拷贝', function (file, dest) {
            let stat = fs.statSync(file);
            fs.copyFileSync(file, dest);
            FileTime.copy(stat, dest); //把原文件的时间属性也拷贝到目标文件。
            
        });
    }

    /**
    * 使用重命名(移动)的方式处理每个文件。
    * 会把原文件的时间属性也拷贝到目标文件。
    */
    rename() {
        this.each('移动', function (file, dest) {
            if (file != dest) {
                let stat = fs.statSync(file);
                fs.renameSync(file, dest);
                FileTime.copy(stat, dest); //把原文件的时间属性也拷贝到目标文件。
            }
        });
    }



}

module.exports = exports = Task;
exports.defaults = require('./Task.defaults');