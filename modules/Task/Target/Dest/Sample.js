

module.exports = {


    get(exif, { fullExif, dateExif, noExif, }) {
        if (!exif) {
            return noExif;
        }


        let sample = exif.model ? fullExif : dateExif;

        sample = sample || noExif;

        return sample;



    },

};