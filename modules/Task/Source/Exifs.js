
module.exports = {
    filter(files, exts) { 

        //exts 可能被指定为 false，以便进行禁用。
        if (!Array.isArray(exts)) {
            return false;
        }

        //过滤出能提取 exif 信息的文件。
        let list = files.filter((file) => {
            //全部转成大写。
            file = file.toUpperCase();

            return exts.some((ext) => {
                //全部转成大写。
                ext = ext.toUpperCase();

                return file.endsWith(ext);
            });
        });

        return list;
    },
};