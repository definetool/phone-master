


// start('/Volumes/3/照片与视频/iPhone/Exports/2023-02-28@1106');
start('/Volumes/3/照片与视频/iPhone/Exports/2023-03-07@1149');







//------------------------------------------------------------------------

function start(dir) {
    const { Timer, Task, } = require('./index');

    let task = new Task(dir);
    let timer = new Timer(task.console);

   

    timer.start(`开始任务 >>`.bold);

    task.on('each', 'dest', function (item, index) {
        let {
            dir, overwrite, file, hash, main, exif,
            dest, sample, date, year, month, day, ext, type, name, basename,
        } = item;

        ext = ext.toLowerCase();

        //返回 false 可以忽略该文件。
        if (ext == '.aae' || ext == '.ini' || ext == '.db') {
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

    });


    task.on('parse', function (dir, info) {
        this.output();

        // this.copy();        //采用复制的方式。
        // this.rename();   //采用移动的方式。

        timer.stop(`<< 结束任务，总耗时: {text}。`.bold);
    });


    task.clear();
    task.parse();

}
