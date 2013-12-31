'use strict';

var request = require('request');
var Q = require('q');
var githubUrlFromGit = require('github-url-from-git');
var url = require('url');

// http://registry.npmjs.org/-/_view/browseAuthors?startkey=%5B%22dylang%22%5D&endkey=%5B%22dylang%22%2C%7B%7D%5D&group_level=5
// http://registry.npmjs.org/grunt-notify

function getFromNpm(url) {
    var deferred = Q.defer();
    request({url: url, json: true}, function(err, res, data){
        if (err) {
            return deferred.reject(err);
        }

        if (!data) {
            return deferred.reject('No data?');
        }

        deferred.resolve(data);
    });
    return deferred.promise;
}

function getModulesByUser(userName) {

    if (!userName) {
        throw new Error('username is required');
    }

    var url = 'http://registry.npmjs.org/-/_view/browseAuthors?startkey=%5B%22' + userName + '%22%5D&endkey=%5B%22' + userName + '%22%2C%7B%7D%5D&group_level=5';

    return getFromNpm(url)
        .then(function(data) {

            if (!data.rows) {
                throw new Error('No data?');
            }

            return data.rows
                .map(function(row){
                    return {
                        name: row.key[1],
                        description: row.key[2],
                        date: new Date(row.key[3]),
                        //readme: row.key[4]
                    };
                }).sort(function(a, b){
                    if (a.date < b.date) return 1;
                    if (a.date > b.date) return -1;
                    return 0;
                });
        });
}

function getModuleInfo(moduleName) {

    if (!moduleName) {
        throw new Error('moduleName is required');
    }

    var url = 'http://registry.npmjs.org/' + moduleName;
    return getFromNpm(url);
}

function userFromModuleName(moduleName) {

    return getModuleInfo(moduleName)
        .then(function(data) {

            if (!data['dist-tags'] || !data['dist-tags'].latest) {
                return false;
            }

            var tag = data['dist-tags'].latest;
            var version = data.versions[tag];
            return version._npmUser.name;
        });
}

function githubRepoFromModuleName(moduleName) {

    return getModuleInfo(moduleName)
        .then(function(data) {
            if (!data['dist-tags'] || !data['dist-tags'].latest) {
                return Q.reject('modulename ' + moduleName + ' seems to be bad');
            }

            var tag = data['dist-tags'].latest;

            if (!data.versions[tag].repository) {
                return Q.reject('No repo for ' + moduleName);
            }

            var repoUrl = data.versions[tag].repository.url;
            var repositoryHomepage = githubUrlFromGit(repoUrl);
            var repo = url.parse(repositoryHomepage).pathname.substring(1);
            return Q.resolve(repo);
        });
}

module.exports = {
    getModulesByUser: getModulesByUser,
    userFromModuleName: userFromModuleName,
    githubRepoFromModuleName: githubRepoFromModuleName,
};