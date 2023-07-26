
const File = require('@definejs/file');
const $String = require('@definejs/string');
const $Date = require('@definejs/date');


const Tag = {
    begin: `<photoshop:DateCreated>`,
    end: `</photoshop:DateCreated>`,
};


module.exports = {
    read(file) { 
        let xmp = `${file.split('.').slice(0, -1).join('.')}.xmp`;

        if (!File.exists(xmp)) {
            return;
        }

        let xml = File.read(xmp);
        let dt = $String.between(xml, Tag.begin, Tag.end);

        if (!dt) {
            return;
        }

        dt = $Date.parse(dt);
        
        if (!dt) {
            return;
        }

        dt = dt.getTime();
        
        return dt;
    },
};