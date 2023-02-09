const { ExifImage, } = require('exif');


module.exports = {
    exif(file, fn) {
        new ExifImage({ 'image': file, }, function (error, data) {
            if (error) {
                // console.log('Error:'.red, error.message.yellow);
                // console.log('File:'.red, file.green);
                fn();
                return;
            }


            //为了节省内存，这里只返回需要用到的几个字段。
            let { image, exif, } = data;

            let make = image.Make;
            let model = image.Model;
            let datetime = exif.DateTimeOriginal;

            //完全没有。
            if (!make && !model && !datetime) {
                fn(null);
                return;
            }

            //只有日期时间。
            if (!make && !model && datetime) {
                fn({ datetime, });
                return;
            }

            //完整信息。
            fn({ make, model, datetime, });


        });
    }
  
};
