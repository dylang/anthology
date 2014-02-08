/*
 * related
 * https://github.com/dylang/related
 *
 * Copyright (c) 2013 Dylan Greene
 * Licensed under the MIT license.
 */

'use strict';

var github = require('./github');
var npm = require('./npm');
var downloadCount = require('./download-count');
var Q = require('q');
var miniMatchFilter = require('./util/mini-match-filter');

function githubDataForModuleName(moduleName) {
    return Q.invoke(npm, 'githubRepoFromModuleName', moduleName)
        .then(github.getData);
}

function sort(key) {
    return function(a, b) {
        return (a[key] < b[key]) ? 1 : -1;
    };
}

function zipModulesGithubData(modules, githubData) {
    var oneDay = 1000 * 60 * 60 * 24;
    var today = new Date();


    return modules.map(function(module, i){

            module.url = githubData[i].value && githubData[i].value.html_url ? githubData[i].value.html_url : '';
            module.stars = githubData[i].value && githubData[i].value.stars ? githubData[i].value.stars : 0;
            module.date = githubData[i].value && githubData[i].value.created_at ? githubData[i].value.created_at : module.date;

            module.days = Math.ceil((today - new Date(module.date)) / oneDay);
            return module;
        })
        .filter(function(module, i){
            return !githubData[i].reason;
        });
}


function zipModuleDownloads(modules, downloads) {

    return modules.map(function(module, i){
            // TODO: date is last update, not creation
            module.downloads = downloads[i] || 0;
        //console.log(module.name, (module.downloads * Math.max(module.stars, 1)) , (Math.pow(Math.max(module.days, 1), 4)));
            module.popularity =  (module.downloads * Math.max(module.stars, 1)) / (Math.pow(Math.max(module.days, 1), 3));
            return module;
        });
}

function applyFilter(filter, modules){
    var filterFn = miniMatchFilter(filter);
    var filteredModules = modules.filter(function(module){
        return filterFn(module.name);
    });

    return Q.allSettled(filteredModules.map(function(module) {
            return githubDataForModuleName(module.name);
        }))
        .then(function(githubData){
           return zipModulesGithubData(filteredModules, githubData);
        })
        .then(function(modules){
            return Q.all(modules.map(function(module) {
                return downloadCount.getDownloadCountForModule(module.name, module.days);
            }))
            .then(function(downloads){
               return zipModuleDownloads(modules, downloads);
            });
        });

}

function forUser(username, filter) {
    return Q.invoke(npm, 'getModulesByUser', username)
        .then(function(modules){
            return applyFilter(filter, modules);
        })
        .then(function(modules) {
            return Q.resolve(modules.sort(sort('popularity')));
        })
        .catch(function(err){
            console.log('error happened');
            console.log(err.stack);
        });
}

module.exports = {
    forUser: forUser
};

forUser('dylang', []).then(function(d){console.log(d); });