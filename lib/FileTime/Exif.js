


const $Date = require('@definejs/date');




//使用 exif 中的日期时间。
module.exports = {
    get(exif) { 
        if (!exif) {
            return;
        }

        let { base, } = exif;

        if (!base) {
            return;
        }

        let { datetime, } = base;
        if (!datetime) {
            return;
        }

        let dt = $Date.parse(datetime);

        if (!dt) {
            return;
        }

        dt = dt.getTime();
        return dt;
    },

};