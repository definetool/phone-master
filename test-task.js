const {  Task, } = require('./index');


let task = new Task({
    source: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.src.test/',

    target: {
        dir: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.dest/',
        clear: true,
    },
});

task.parse();

task.on('parse', function (info) {
    task.copy();
});

task.on('process', function (item) {
    let { ext, dest, } = item;
    ext = ext.toLowerCase();

    if (ext == '.heic') {
        return '';
    }

});




