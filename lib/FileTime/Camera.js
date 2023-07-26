
const path = require('path');

const $Date = require('@definejs/date');


const POS = {
    begin: `VIDEO_`.length,
    end: 0 - `.mp4`.length,
};

//针对小米摄像头产生的视频。
//从文件名中判断出日期时间，
//如 `VIDEO_20230707_171547.mp4` 或 `VIDEO_1688721431488.mp4` 这两种。
module.exports = {
    read(file) { 
        let name = path.basename(file);
        let regexp = /^VIDEO_(\d{8}_\d{6}|\d{13})\.mp4$/g;

        if (!regexp.test(name)) {
            return;
        }

        let dt = name.slice(POS.begin, POS.end);

        //针对如 `VIDEO_20230707_171547.mp4` 的情况。
        if (dt.includes('_')) {
            let a = dt.split('_');
            let date = a[0];
            let time = a[1];

            let year = date.slice(0, 4);
            let month = date.slice(4, 6);
            let day = date.slice(6);
            let hour = time.slice(0, 2);
            let minute = time.slice(2, 4);
            let second = time.slice(4);

            dt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
        }
        else {
            //针对如 `VIDEO_1688721431488.mp4` 的情况。
            dt = Number(dt);
        }

        dt = $Date.parse(dt);

        if (!dt) {
            return;
        }

        dt = dt.getTime();

        
        return dt;
    },
};