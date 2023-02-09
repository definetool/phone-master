# @definetool/photo-master

手机照片分类工具。

### 示例

#### 使用默认设置
``` js

const { process, } = require('@definetool/photo-master');

process({
    source: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.src/',
    target: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.dest/',
});


```

#### 自定义方式
``` js

const { Task, } = require('@definetool/photo-master');

let task = new Task({
    source: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.src/',

    target: {
        dir: '/Volumes/3/照片与视频/iPhone/Exports/2023-01-30@0949.dest/',
        clear: true,
    },
});

task.parse();


task.on('parse', function (info) {
    task.copy();
});

//开始复制到目标目录时触发。
task.on('process', function (item) {
    let { ext, dest, } = item;
    ext = ext.toLowerCase();

    if (ext == '.heic') {
        return false;   //返回 false 可以忽略该文件，即不要复制。
    }

});

```







