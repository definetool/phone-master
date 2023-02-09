const path = require('path');

module.exports = {

    get(file) {
        let ext = path.extname(file);               //后缀名，如 `.JPG`、`.mov`
        let type = ext.slice(1);                    //类型，如 `JPG`、'mov'
        let name = path.basename(file);             //短文件名，如 `IMG_6010.JPG`。
        let basename = path.basename(file, ext);    //短文件名，如 `IMG_6010`。

        return { basename, name, ext, type, };
    },

};