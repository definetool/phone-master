
const { Task, Timer, } = require('./index');


let task = new Task({
    source: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.src/',
    target: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.dest/',
});

let timer = new Timer(task.console);


timer.start(`开始任务 >>`.bold);


task.on('parse', function (info) {
    task.clear();
    task.copy();

    timer.stop(`<< 结束任务，总耗时: {text}。`.bold);
});

//开始复制到目标目录时触发。
task.on('process', function (item) {
    let {
        dir, overwrite, file, md5, exif,
        dest, sample, date, year, month, day, ext, type, name, basename,
    } = item;

    ext = ext.toLowerCase();

    //返回 false 可以忽略该文件，即不要复制。
    if (ext == '.ini') {
        return false;
    }

    //如 `-8364315808989964201.mp4`
    if (name.startsWith('-') && /^\d{19}$/.test(basename.slice(1)) && ext == '.mp4') {
        return `${dir}/小视频/${date}/${name}`;
    }

    //如 `-4629607845102714697.mov`
    if (name.startsWith('-') && /^\d{19}$/.test(basename.slice(1)) && ext == '.mov') {
        return `${dir}/小视频/${date}/${name}`;
    }

    //如 `7260817496827441149.mp4`
    if (/^\d{19}$/.test(basename) && ext == '.mp4') {
        return `${dir}/小视频/${date}/${name}`;
    }

    //如 `RPReplay_Final1674383698.mp4`
    if (name.startsWith('RPReplay_Final') && ext == '.mp4') {
        return `${dir}/录屏/${date}/${name}`;
    }

    //如 `VIDEO_20230125_101152.mp4`
    if (name.startsWith('VIDEO_') && ext == '.mp4') {
        return `${dir}/摄像头/${date}/${name}`;
    }

    //如 `798_raw.mp4`
    if (name.endsWith('_raw.mp4')) {
        return `${dir}/微信/接收的原视频/${date}/${name}`;
    }

    //如 `IMG_7779.MOV`
    if (name.startsWith('IMG_') && name.endsWith('.MOV')) {
        return `${dir}/手机DV/${date}/${name}`;
    }

    //如 `001_WC-EditVideo_1.mp4`
    if (name.includes('_WC-EditVideo_') && ext == '.mp4') {
        return `${dir}/微信/编辑视频/${date}/${name}`;
    }

});

task.parse();