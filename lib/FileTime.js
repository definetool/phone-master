
const fs = require('fs');
const { utimesSync, } = require('utimes');

const Camera = require('./FileTime/Camera');
const Timelapse = require('./FileTime/Timelapse');
const Exif = require('./FileTime/Exif');
const XMP = require('./FileTime/XMP');

module.exports = {

    read(file, exif) { 
        let stat = null;

        let dt = Exif.get(exif) 
            || Camera.read(file)
            || Timelapse.read(file)  //小米摄像头延时拍摄。
            || XMP.read(file); 

        if (dt) {
            stat = {
                'atimeMs': dt,
                'mtimeMs': dt,
                'birthtimeMs': dt,
            };
        }
        else {
            let { atimeMs, mtimeMs, birthtimeMs, } = fs.statSync(file);

            stat = {
                atimeMs,
                mtimeMs,
                birthtimeMs,
            };
        }

        return stat;
    },

    copy(stat, dest) { 
        let { atimeMs, mtimeMs, birthtimeMs, } = stat;

        //去掉小数部分。
        let atime = Number.parseInt(atimeMs.toString().split('.')[0]);
        let mtime = Number.parseInt(mtimeMs.toString().split('.')[0]);
        let btime = Number.parseInt(birthtimeMs.toString().split('.')[0]);

        utimesSync(dest, { atime, mtime, btime, });
    },
};