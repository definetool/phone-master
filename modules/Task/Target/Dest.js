
const $String = require('@definejs/string');
const $Path = require('@definejs/path');

const Path = require('./Dest/Path');
const Sample = require('./Dest/Sample');
const Time = require('./Dest/Time');

module.exports = {


    get({ dir, file, exif, samples, }) {
        let { make, model, datetime, } = exif || {};

        let sample = Sample.get(exif, samples);
        let { date, year, month, day, } = Time.get(exif, file);
        let { ext, type, name, basename, } = Path.get(file);


        let dest = $String.format(sample, {
            dir,

            make,
            model,

            date,
            year,
            month,
            day,

            name,
            basename,
            ext,
            type,
        });
        dest = $Path.normalize(dest);


        return { dest, sample, date, year, month, day, ext, type, name, basename, };

        if (process) {
            let value = process({
                ...info,
                dest,
                sample,
                samples,
            });

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
        }


        return dest;


    },

};