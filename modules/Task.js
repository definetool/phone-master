
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
    *   config = {
    *       home: '',       //会话过程中产生的日志等临时文件的存放目录。 建议每次都使用一个不同的目录，以方便多次运行后进行查找。
    *       console: '',    //会话过程中产生的日志的文件名称。 如果指定，则写入此文件；否则仅在控制台输出。
    *       cache: '',      //解析 source 目录和 target 目录中的文件 MD5 时要保存的元数据信息的目录名，建议指定为 `.sync-files/`。
    *       source: '',     //要同步的源目录。
    *       target: '',     //要同步的目标目录。
    *       patterns: [],   //要同步的文件列表模式。 如果不指定，或指定为空数组，则表示全部文件。
    *   };
    */
    constructor(config) {
        let { defaults, } = exports;
        let { source, target, } = config;

        if (typeof source == 'string') {
            source = { 'dir': source, };
        }

        if (typeof target == 'string') {
            target = { 'dir': target, };
        }

        source = { ...defaults.source, ...source, };
        target = { ...defaults.target, ...target, };
        config = { ...defaults, ...config, source, target, };

        let meta = Meta.create(config);
        let console = Console.create(meta.output.console);
        let timer = new Timer(console);
        let emitter = new Emitter(this);

        Object.assign(meta, { console, timer, emitter, });
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
        let { console, timer, source, target, } = meta;

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


    copy() {
        let meta = mapper.get(this);
        let { console, info, target, } = meta;
        let { tasks, } = info;

        if (target.clear) {
            console.log(`清空目录:`.bgYellow, target.dir.red);
            Directory.clear(target.dir);
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