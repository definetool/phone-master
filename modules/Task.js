
require('colors');

const File = require('@definejs/file');
const Directory = require('@definejs/directory');
const Emitter = require('@definejs/emitter');
const $String = require('@definejs/string');

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
    * 已重载 Task(config);
    * 
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
    *           clear: false,
    *           overwrite: false,
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


    on(...args) { 
        let meta = mapper.get(this);
        meta.emitter.on(...args);
    }

    /**
    * 解析。
    * 提取文件的 MD5 信息，保存到 cache 目录中。
    */
    parse() {
        let meta = mapper.get(this);
        let { console, source, target, } = meta;
        let timer = new Timer(console);

        timer.start(`开始分析 >>`.bold);

        let { files, exifs, } = Source.scan(console, source);
        let { file$md5, md5$files, md5$main, mains, } = MD5.parse(console, files);
       

        Exif.extract(console, exifs, function (file$exif) {
            let tasks = Target.parse({ target, files, file$md5, md5$main, file$exif, });

            let info = {
                files,
                file$md5,
                md5$files,
                md5$main,
                mains,
                exifs,
                file$exif,
                tasks,      //可能为 undefined。
            };

            Object.assign(meta.info, info);
            File.writeJSON(meta.output.info, info);

            timer.stop(`<< 结束分析，耗时: {text}。`.bold);

            meta.emitter.fire('parse', [info]);


        });

    }

    clear() { 
        let meta = mapper.get(this);
        let { console, target, } = meta;
        let { dir, } = target;

        console.log(`清空目录:`.bgYellow, dir.red);
        Directory.clear(dir);
    }

    copy() {
        let meta = mapper.get(this);
        let { console, info, target, } = meta;
        let { tasks, } = info;

        if (target.clear) {
            this.clear();
        }


        Target.copy(console, tasks, function (item) { 
            let { dest, sample, } = item;
            let values = meta.emitter.fire('process', [item]);
            let value = (values || []).slice(-1)[0]; //取最后一项。
           

            //大多数情况下是没有返回值，即 undefined，此时用回原来的。
            if (value === undefined) {
                return dest;
            }

            //外部的处理函数明确返回了 false，则跳过该文件。
            if (value === false) {
                return '';
            }

            if (typeof value == 'string') {
                return value;
            }

            if (typeof value == 'object') {
                return $String.format(sample, value);
            }

            throw new Error('无法识别的返回值：dest');
        });

    }


}

module.exports = exports = Task;
exports.defaults = require('./Task.defaults');