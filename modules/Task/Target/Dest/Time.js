
const fs = require('fs');
const $Date = require('@definejs/date');


module.exports = {
    
    get(exif, file) {
        //优先使用 exif 中的日期。
        //如果没有，再使用文件的日期。
        //exif 可能为空。
        let dt = exif ? exif.datetime : null;    

        if (!dt) {
            let stat = fs.statSync(file);
            // dt = $Date.format(stat.mtime, 'yyyy-MM-dd HH:mm:ss'); //文件的生成日期。
            dt = $Date.format(stat.birthtime, 'yyyy-MM-dd HH:mm:ss'); //文件的生成日期。
        }

        let date = dt.split(' ')[0]; //日期部分。
        let a = date.split(':');
        let year = a[0];
        let month = a[1];
        let day = a[2];

        return { date, year, month, day, };

        
    },
};