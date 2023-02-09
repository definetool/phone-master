

const Task = require('./modules/Task');


module.exports = exports = {
    Task,

    process(config) { 
        let task = new Task(config);

        task.parse();

        task.on('parse', function (info) { 
            task.copy();
        });
    },

};




