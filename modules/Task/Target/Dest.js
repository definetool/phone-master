
const $String = require('@definejs/string');
const $Path = require('@definejs/path');

const Path = require('./Dest/Path');
const Sample = require('./Dest/Sample');
const Time = require('./Dest/Time');

module.exports = {


    get({ dir, file, exif, samples, timeKey, }) {
        let baseExif = exif ? exif.base : null;
        let { make, model, datetime, } = baseExif || {};

        let sample = Sample.get(baseExif, samples);
        let { date, year, month, day, } = Time.get(baseExif, file, timeKey);
        let { ext, type, name, basename, } = Path.get(file);

        let dest = $String.format(sample, {
            dir,
            make, model,
            date, year, month, day,
            ext, type, name, basename,
        });

        dest = $Path.normalize(dest);


        return {
            dest, sample,
            make, model,
            date, year, month, day,
            ext, type, name, basename,
        };
    },

    check(item, values) { 
        let { dest, sample, } = item;
        let value = (values || []).slice(-1)[0]; //取最后一项。

        //大多数情况下是没有返回值，即 undefined，此时用回原来的。
        if (value === undefined) {
            return dest;
        }

        //外部的处理函数明确返回了 false，则跳过该文件。
        if (value === false) {
            return '';
        }

        if (typeof value == 'string') {
            return value;
        }

        if (typeof value == 'object') {
            return $String.format(sample, value);
        }

        console.log(value);
        throw new Error(`无法识别的返回值: value`);
    },

};