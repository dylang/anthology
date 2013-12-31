'use strict';
var npmconf = require('npmconf');
var Q = require('q');

function getUsername() {
    return Q.nfcall(npmconf.load)
        .then(function(conf){
            return conf.get('username');
        }, function(err){
            console.log('err getting username', err);
            return '';
        });
}
module.exports = {
    getUsername: getUsername
};