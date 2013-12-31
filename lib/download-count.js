'use strict';

var request = require('request');
var Q = require('q');

 //http://isaacs.iriscouch.com/downloads/_design/app/_view/pkg?startkey=%5B%22grunt-about%22%2C%222013-10-28%22%5D&endkey=%5B%22grunt-about%22%2C%7B%7D%5D&group_level=2

function day(s) {
    return (new Date(s)).toISOString().substr(0, 10);
}

function getDownloadCountForModule(moduleName, days) {
    var deferred = Q.defer();

    //console.log(moduleName, days);
    days = Math.max(days, 365);

    var start = Date.now() - 1000 * 60 * 60 * 24 * days;
    var end = Date.now() - 1000 * 60 * 60 * 24;
    start = new Date(start).toISOString().split('T')[0];

    var options = {
        url: 'http://isaacs.iriscouch.com//downloads/_design/app/_view/pkg',
        json: true,
        qs: {
            startkey: JSON.stringify([moduleName, day(start)]),
            endkey: JSON.stringify([moduleName, day(end) || {}]),
            group_level: 1
        }
    };

    request(options, function(err, res, data){
        if (err) {
            return deferred.reject(err);
        }

        if (!data) {
            console.log('download count no data', moduleName);
            return deferred.reject(new Error('No data?'));
        }

        if (!data.rows || !data.rows[0] || !data.rows[0].value) {
            return deferred.resolve(0);
        }

        /*
            {
            "rows":[
            {"key":["grunt-notify"],"value":10115}
            ]}
         */

        //console.log('wtf', moduleName, days, data.rows[0].value, data);

        if (typeof data.rows[0].value !== 'number') {
            return deferred.resolve(0);
        }

        deferred.resolve(data.rows[0].value);
    });
    return deferred.promise;
}

module.exports = {
    getDownloadCountForModule: getDownloadCountForModule
};