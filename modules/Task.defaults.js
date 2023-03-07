
module.exports = {
   
    output: {
        dir: `./output/`,
        console: `console.log`,
    },
  
    source: {
        dir: '',

        //是否启用 hash 分析以查找出内容重复的文件。
        hash: true,

        patterns: [
            // '**/*.*',        //匹配 `文件名.后缀名`，但不匹配 `.后缀名` 和 `文件名`。
            '**/*',             //匹配 `文件名.后缀名`、`文件名`、`文件名.`，但不匹配 `.后缀名`。 即匹配所有含有文件名的文件。
            '**/.*',            //匹配 `.后缀名`，即匹配只含有后缀名的文件。
            '!**/.ds_store',
            '!**/.DS_Store',
            '!**/desktop.ini',
            '!**/Desktop.ini',
            '!**/thumbs.db',
            '!**/Thumbs.db', 
        ],


        //需要进行 exif 信息抽取的文件类型，不区分大小写。
        //如果指定为 false，则不进行提取，包括不显示界面。
        exifs: [
            '.jpg',
            '.jpeg',
        ],
    },

    

   

    target: {
        dir: '',

        //是否覆盖目标文件。
        overwrite: false,

        main: {
            //可以提取出完整 exif 信息的照片的输出路径。
            //如果不指定，则使用下面的 noExif 字段。
            fullExif: '{dir}/photo/{make}/{model}/{year}/{year}-{month}-{day}/{name}',

            //只能提出部分 exif 信息的照片的输出路径。 此 exif 不包含相机型号等信息，只包含日期信息。
            //如果不指定，则使用下面的 noExif 字段。
            // dateExif: '{dir}/repeat/date/{year}/{year}-{month}-{day}/{name}',

            //不能提取出 exif 信息的文件。
            noExif: '{dir}/type/{type}/{date}/{name}',
        },


        //内容完全相同的重复文件，需要复制的目录。 
        //如果为空，则忽略。
        repeat: {
            //可以提取出完整 exif 信息的照片的输出路径。
            //如果不指定，则使用下面的 noExif 字段。
            fullExif: '{dir}/repeat/photo/{make}/{model}/{year}/{year}-{month}-{day}/{name}',

            //只能提出部分 exif 信息的照片的输出路径。 此 exif 不包含相机型号等信息，只包含日期信息。
            //如果不指定，则使用下面的 noExif 字段。
            // dateExif: '{dir}/repeat/date/{year}/{year}-{month}-{day}/{name}',

            //不能提取出 exif 信息的文件。
            noExif: '{dir}/repeat/type/{type}/{date}/{name}',
        },
    },
};