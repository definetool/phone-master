
const colors = require('colors');
const Tasker = require('@definejs/tasker');

const ProgressBar = require('../../lib/ProgressBar');
const Timer = require('../../lib/Timer');

const Image = require('./Exif/Image');

module.exports = {

    extract(console, files, fn) {
        let bar = new ProgressBar(files, console);
        let timer = new Timer(console);

        let tasker = new Tasker(files);
        let file$exif = {};
        let maxIndex = files.length - 1;

        timer.start(`开始提取 exif: 共 ${colors.cyan(files.length)} 个 >>`.bold);

        tasker.on('each', function (file, index, done) {
            let link = index == maxIndex ? `└──` : `├──`;

            Image.exif(file, function (raw, base) {
                bar.render({
                    text: '提取 exif: ',
                    msg: `${link}${file.cyan}`,
                });

                file$exif[file] = { raw, base, };

                done();
            });
        });

        tasker.on('all', function () {
            timer.stop(`<< 结束提取 exif，耗时: {text}。`.bold);

            fn(file$exif);
        });

        tasker.serial();
    },
};
