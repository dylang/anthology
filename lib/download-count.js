'use strict';

var request = require('request');
var Q = require('q');

 //http://isaacs.iriscouch.com/downloads/_design/app/_view/pkg?startkey=%5B%22grunt-about%22%2C%222013-10-28%22%5D&endkey=%5B%22grunt-about%22%2C%7B%7D%5D&group_level=2

function getDownloadCountForModule(moduleName) {
    var deferred = Q.defer();

    // move to all-time when https://github.com/npm/download-counts/issues/1 is resolved
    //https://api.npmjs.org/downloads/point/all-time/jquery

    var options = {
        url: 'https://api.npmjs.org/downloads/point/last-month/' + moduleName,
        json: true
    };

    request(options, function(err, res, data){
        if (err) {
            console.log('DOWNLOAD COUNT ERR', moduleName, options.url, err, res.body);
            return deferred.reject(err);
        }

        deferred.resolve(data.downloads || 0);
    });
    return deferred.promise;
}

module.exports = {
    getDownloadCountForModule: getDownloadCountForModule
};
