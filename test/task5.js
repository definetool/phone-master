
const fs = require('fs');
const { Task, Timer, fnDest, } = require('../index');


let dir = '/Volumes/3/照片与视频/iPhone/Exports/2023-02-14@1719/';

let config = {
    output: `${dir}output/`,
    target: `${dir}target/`,

    source: {
        dir: `${dir}source/`,
        md5: false,
        // exifs: false,
    },

};

let task = new Task(config);
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
