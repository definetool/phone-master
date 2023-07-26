const Timer = require('./lib/Timer');
const Task = require('./modules/Task');


module.exports = exports = {
    Timer,
    Task,

    copy(config, fnDest = exports.fnDest) {
        let task = new Task(config);
        let timer = new Timer(task.console);

        timer.start(`开始任务 >>`.bold);

        task.on('each', {
            'dest': fnDest,
        });

        task.on('parse', function (dir, info) {
            task.output();
            task.copy();

            timer.stop(`<< 结束任务，总耗时: {text}。`.bold);
        });

        task.clear();
        task.parse();
    },

    rename(config, fnDest = exports.fnDest) {
        let task = new Task(config);
        let timer = new Timer(task.console);


        timer.start(`开始任务 >>`.bold);

        task.on('each', {
            'dest': fnDest,
        });

        task.on('parse', function (dir, info) {
            task.output();
            task.rename();

            timer.stop(`<< 结束任务，总耗时: {text}。`.bold);
        });

        task.clear();
        task.parse();
    },

    //提供一个默认的自定义路由。
    //用户可以自定义一个新的。
    fnDest(item, index) {
        let {
            dir, overwrite, file, hash, main, exif,
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

            if (name.endsWith('_timelapse_video.mp4')) {
                return `摄像头/延时拍摄`;
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

};




