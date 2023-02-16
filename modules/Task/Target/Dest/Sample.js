

module.exports = {


    get(baseExif, { fullExif, dateExif, noExif, }) {
        if (!baseExif) {
            return noExif;
        }


        let sample = baseExif.model ? fullExif : dateExif;

        sample = sample || noExif;

        return sample;



    },

};