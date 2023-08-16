
const $Date = require('@definejs/date');


let pos = {
    begin: `VIDEO_`.length,
    end: 0 - `.mp4`.length,
};



//regexp 不能重复使用，必须每次新建一个。
let list = [
    {
        //`VIDEO_20230707_171547.mp4`
        test: function (name) { 
            let regexp = /^VIDEO_\d{8}_\d{6}\.mp4$/g;
            return regexp.test(name);
        },
        fn: function (dt) {
            let a = dt.split('_');
            let date = a[0];
            let time = a[1];

            let year = date.slice(0, 4);
            let month = date.slice(4, 6);
            let day = date.slice(6);
            let hour = time.slice(0, 2);
            let minute = time.slice(2, 4);
            let second = time.slice(4);

            dt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            return dt;
        },
    },
    {
        //`VIDEO_1688721431488.mp4`
        test: function (name) {
            let regexp = /^VIDEO_\d{13}\.mp4$/g;
            return regexp.test(name);
        },
        fn: function (dt) {
            dt = Number(dt);
            return dt;
        },
    },
    {
        //`VIDEO_2023-08-08-05-30-32.mp4`
        test: function (name) {
            let regexp = /^VIDEO_\d{4}\-\d{2}\-\d{2}\-\d{2}\-\d{2}\-\d{2}\.mp4$/g;
            return regexp.test(name);
        },
        fn: function (dt) { 
            let a = dt.split('-');
            let year = a[0];
            let month = a[1];
            let day = a[2];
            let hour = a[3];
            let minute = a[4];
            let second = a[5];

            dt = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            return dt;
        },
    },

];

module.exports = {
    parse(name) { 
        let item = list.find(({ test, }) => {
            return test(name);
        });

        if (!item) {
            return;
        }

   
        let dt = name.slice(pos.begin, pos.end);

        dt = item.fn(dt);
        dt = $Date.parse(dt);

        if (!dt) {
            return;
        }

        dt = dt.getTime();
        return dt;
    },
};