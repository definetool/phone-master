
const fs = require('fs');
const $Date = require('@definejs/date');


module.exports = {
    
    get(baseExif, file) {
        //优先使用 exif 中的日期。
        //如果没有，再使用文件的日期。
        //baseExif 可能为空。
        let dt = baseExif ? baseExif.datetime : null;    

        if (!dt) {
            let stat = fs.statSync(file);
            dt = stat.birthtime;
        }


        dt = $Date.parse(dt);

        // dt = $Date.format(dt, 'yyyy-MM-dd HH:mm:ss'); //文件的生成日期。
        dt = $Date.format(dt, 'yyyy-MM-dd HH:mm:ss'); //文件的生成日期。

        let date = dt.split(' ')[0]; //日期部分。
        let a = date.split('-');
        let year = a[0];
        let month = a[1];
        let day = a[2];

        return { date, year, month, day, };

        
    },
};