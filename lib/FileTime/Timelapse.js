
const path = require('path');
const $Date = require('@definejs/date');


//针对小米摄像头【延时拍摄】产生的视频。
//从文件名中判断出日期时间，
//如 `1690062002_timelapse_video.mp4`。
module.exports = {
    read(file) { 
        let name = path.basename(file);
        let regexp = /^\d{10}_timelapse_video\.mp4$/g;

        if (!regexp.test(name)) {
            return;
        }

        let dt = name.slice(0, 10);

        dt = Number(dt) * 1000;
        dt = $Date.parse(dt);

        if (!dt) {
            return;
        }

        dt = dt.getTime();

        
        return dt;
    },
};