
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

       


    },

};