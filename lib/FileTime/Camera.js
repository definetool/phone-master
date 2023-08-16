
const path = require('path');
const DateTime = require('./Camera/DateTime');


//针对小米摄像头产生的视频。
//从文件名中判断出日期时间，
//如:
//  `VIDEO_20230707_171547.mp4`
//  `VIDEO_1688721431488.mp4`
//  `VIDEO_2023-08-08-05-30-32.mp4`
module.exports = {
    read(file) { 
        let name = path.basename(file);
        let dt = DateTime.parse(name);
        return dt;
    },
};