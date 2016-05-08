

module.exports = {
    perfSort: function(a,b) {
        if (a.attributes.sort < b.attributes.sort) {
            return -1;
        } else if (a.attributes.sort > b.attributes.sort) {
            return 1;
        }

        return 0;
    }
};