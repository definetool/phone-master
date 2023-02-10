
const Timer = require('./lib/Timer');
const Task = require('./modules/Task');


module.exports = exports = {
    Timer,
    Task,

    process(config) {
        let task = new Task(config);

        task.parse();

        task.on('parse', function (info) {
            task.copy();
        });
    },

};




