
const fs = require('fs');
const { utimesSync, } = require('utimes');

module.exports = {


    copy(stat, dest) { 
        //重载 copy(file, dest);
        if (typeof stat == 'string') {
            stat = fs.statSync(stat);
        }

        utimesSync(dest, {
            'atime': Number.parseInt(stat.atimeMs.toString().split('.')[0]),
            'mtime': Number.parseInt(stat.mtimeMs.toString().split('.')[0]),
            'btime': Number.parseInt(stat.birthtimeMs.toString().split('.')[0]),
        });
    },
};