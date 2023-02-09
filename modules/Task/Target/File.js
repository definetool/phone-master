
const File = require('@definejs/file');

module.exports = {
    
    copy({ file, dest, overwrite, link, }) {
        let msgs = [];

        if (File.exists(dest)) {
            if (overwrite) {
                msgs.push(`├──从:${file.green}`);
                msgs.push(`${link}到(覆盖):${dest.magenta}`);
                File.copy(file, dest);
            }
            else {
                msgs.push(`${link}已存在(跳过):${dest.gray}`)
            }
        }
        else {
            msgs.push(`├──从:${file.green}`);
            msgs.push(`${link}到:${dest.yellow}`);
            File.copy(file, dest);
        }

        return msgs;

    },
};