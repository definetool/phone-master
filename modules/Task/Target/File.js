
const Directory = require('@definejs/directory');
const File = require('@definejs/file');


module.exports = exports = {

    each({ file, dest, overwrite, link }, fnProcess) {
        let msgs = [];

        
        if (File.exists(dest)) {
            if (overwrite) {
                msgs.push(`├──从:${file.green}`);
                msgs.push(`${link}到(覆盖):${dest.magenta}`);
                fnProcess();
            }
            else {
                msgs.push(`${link}已存在(跳过):${dest.gray}`);
            }
        }
        else {
            msgs.push(`├──从:${file.green}`);
            msgs.push(`${link}到:${dest.yellow}`);

            Directory.create(dest); //确保目标目录级别的路径先存在。
            fnProcess();
        }

        return msgs;

    },
    

};