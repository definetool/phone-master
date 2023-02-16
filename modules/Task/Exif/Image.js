const { ExifImage, } = require('exif');

//`2023:01:30 12:54:36`  ---> `2023-01-30 12:54:36`。
//`2023:01:306`  ---> `2023-01-30`。
function fixDateTime(item, key) {
    let dt = item[key];

    if (!dt || typeof dt != 'string') {
        return dt;
    }

    let a = dt.split(' ');
    let date = a[0];
    let time = a[1];

    date = date.split(':').join('-');

    item[key] = date;

    if (time) {
        item[key] += ` ${time}`;
    }
    

}



module.exports = {
    exif(file, fn) {
        new ExifImage({ 'image': file, }, function (error, raw) {


            if (error) {
                // console.log('Error:'.red, error.message.yellow);
                // console.log('File:'.red, file.green);
                fn();
                return;
            }
          



            //为了节省内存，这里只返回需要用到的几个字段。
            let { image, thumbnail, exif, gps, interoperability, makernote, } = raw;

            fixDateTime(image, 'ModifyDate');
            fixDateTime(exif, 'DateTimeOriginal');
            fixDateTime(exif, 'CreateDate');
            fixDateTime(gps, 'GPSDateStamp');



            let make = image.Make;
            let model = image.Model;
            let datetime = exif.DateTimeOriginal;

            //完全没有。
            if (!make && !model && !datetime) {
                fn(raw, null);
                return;
            }

            //只有日期时间。
            if (!make && !model && datetime) {
                fn(raw, { datetime, });
                return;
            }

            //完整信息。
            fn(raw, { make, model, datetime, });


        });
    }
  
};
