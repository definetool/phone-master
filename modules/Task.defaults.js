
module.exports = {
   
    output: {
        dir: `./output/`,
        console: `console.log`,
        info: `info.json`,
    },
  
    source: {
        dir: '',

        patterns: [
            '**/*',
        ],

        //要排除的文件，即忽略的文件。
        excludes: [
            // '**/*.ini',
            // '**/*.HEIC',
        ],

        //需要进行 exif 信息抽取的文件类型。 不区分大小写。
        exifs: [
            '.jpg',
            '.jpeg',
        ],
    },

    

   

    target: {
        dir: '',

        //开始拷贝之前是否先清空目标目录。
        clear: false,

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