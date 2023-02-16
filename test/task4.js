

const { Task, Timer, fnDest, } = require('../index');


let dir = '/Volumes/3/照片与视频/iPhone/Exports/2023-02-14@1719/';


let task = new Task(dir);
let timer = new Timer(task.console);

timer.start(`开始任务 >>`.bold);


task.on('each', {
    'dest': fnDest,
});


task.on('parse', function (dir, info) {
    this.clear();
    this.output();
    this.copy();
    // this.rename();

    timer.stop(`<< 结束任务，总耗时: {text}。`.bold);
});


task.parse();
