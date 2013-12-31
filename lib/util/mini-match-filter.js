'use strict';
var Minimatch =  require('minimatch').Minimatch,
    util = require('util');

function filter (patterns) {

    var minimatches = patterns.map(function(pattern){
        return new Minimatch(pattern);
    });

    return function(value) {

        if (!minimatches || !minimatches.length) {
            return true;
        }

        var isMatch = true;
        minimatches.forEach(function(minimatch) {
        if (minimatch.negate) {
            if(!minimatch.match(value)) {
                isMatch = false;
            }
        }
        else {
            if(!minimatch.match(value)) {
                isMatch = false;
            }
        }
    });
    return isMatch;
    };
}

module.exports = filter;