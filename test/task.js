
const fs = require('fs');
const File = require('@definejs/file');
const { Task, Timer, } = require('../index');


let dir = '/Volumes/3/照片与视频/iPhone/Exports/2023-02-14@1719/';

let config = {
    output: {
        dir: `${dir}/output/`,
        console: `console.log`,
    },

    source: {
        dir: `${dir}/source/`,
        patterns: [
            '**/*',
        ],

        //要排除的文件，即忽略的文件。
        excludes: [
            // '**/*.ini',
            // '**/*.HEIC',
        ],

        //需要进行 exif 信息抽取的文件类型。 不区分大小写。
        exifs: [
            '.jpg',
            '.jpeg',
        ],
    },

    target: {
        dir: `${dir}/target/`,

        //是否覆盖目标文件。
        overwrite: false,

        main: {
            //可以提取出完整 exif 信息的照片的输出路径。
            //如果不指定，则使用下面的 noExif 字段。
            fullExif: '{dir}/photo/{make}/{model}/{year}/{year}-{month}-{day}/{name}',

            //只能提出部分 exif 信息的照片的输出路径。 此 exif 不包含相机型号等信息，只包含日期信息。
            //如果不指定，则使用下面的 noExif 字段。
            // dateExif: '{dir}/repeat/date/{year}/{year}-{month}-{day}/{name}',

            //不能提取出 exif 信息的文件。
            noExif: '{dir}/type/{type}/{date}/{name}',
        },


        //内容完全相同的重复文件，需要复制的目录。 
        //如果为空，则忽略。
        repeat: {
            //可以提取出完整 exif 信息的照片的输出路径。
            //如果不指定，则使用下面的 noExif 字段。
            fullExif: '{dir}/repeat/photo/{make}/{model}/{year}/{year}-{month}-{day}/{name}',

            //只能提出部分 exif 信息的照片的输出路径。 此 exif 不包含相机型号等信息，只包含日期信息。
            //如果不指定，则使用下面的 noExif 字段。
            // dateExif: '{dir}/repeat/date/{year}/{year}-{month}-{day}/{name}',

            //不能提取出 exif 信息的文件。
            noExif: '{dir}/repeat/type/{type}/{date}/{name}',
        },
    },
};

let task = new Task(config);
let timer = new Timer(task.console);

timer.start(`开始任务 >>`.bold);


task.on('each', {
    'dest': function (item, index) {
        let {
            dir, overwrite, file, md5, main, exif,
            dest, sample, date, year, month, day, ext, type, name, basename,
        } = item;

        ext = ext.toLowerCase();

        //返回 false 可以忽略该文件。
        if (ext == '.ini') {
            return false;
        }

        let router = (function () { 
            //如 `IMG_7779.MOV`
            if (name.startsWith('IMG_') && name.endsWith('.MOV')) {
                return `手机DV`;
            }

            //如 `VIDEO_20230125_101152.mp4`
            if (name.startsWith('VIDEO_') && ext == '.mp4') {
                return `摄像头`;
            }

            //如 `RPReplay_Final1674383698.mp4`
            if (name.startsWith('RPReplay_Final')) {
                return `录屏`;
            }

            //如 `798_raw.mp4`
            if (name.endsWith('_raw.mp4')) {
                return `微信/接收的原视频`;
            }

            //如 `001_WC-EditVideo_1.mp4`
            if (name.includes('_WC-EditVideo_') && ext == '.mp4') {
                return `微信/编辑产生的视频`;
            }

            //如 `-8364315808989964201.mp4`
            //如 `-4629607845102714697.mov`
            if (name.startsWith('-') && (ext == '.mp4' || ext == '.mov')) {
                return `小视频`;
            }

            //如 `7260817496827441149.mp4`
            //如 `7260817496827441149.move`
            if (/^\d{19}$/.test(basename) && (ext == '.mp4' || ext == '.mov')) {
                return `小视频`;
            }
        })();

        if (router) {
            return `${dir}/${file == main ? '' : 'repeat'}/${router}/${date}/${name}`;
        }

    },

    // 'process': function (file, dest, item, index) { 
    //     fs.copyFileSync(file, dest);
    // },
});


task.on('parse', function (dir, info) {
    this.clear();

    Object.entries(info).forEach(function ([name, json]) {
        File.writeJSON(`${dir}/${name}.json`, json);
    });


    this.each('拷贝', function (file, dest) {
        fs.copyFileSync(file, dest);
    });

    // this.each('移动', function (file, dest) {
    //     fs.renameSync(file, dest);
    // });

    timer.stop(`<< 结束任务，总耗时: {text}。`.bold);
});


task.parse();
