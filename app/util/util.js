

module.exports = {
    perfSort: function(a,b) {
        if (a.attributes.sort) {
            if (a.attributes.sort < b.attributes.sort) {
                return -1;
            } else if (a.attributes.sort > b.attributes.sort) {
                return 1;
            }
        } else if (a.attributes.year) {
            if (a.attributes.year !== b.attributes.year) {
                return a.attributes.year - b.attributes.year;
            } else {
                return -1;
            }
        }

        return 0;
    }
};