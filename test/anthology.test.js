'use strict';
var expect = require('chai').expect;
var Q = require('q');

var proxyquire = require('proxyquire').noCallThru();
var anthology = proxyquire('../lib/anthology.js', {
    './npm': {
        githubRepoFromModuleName: function(module){
            var npmToGithubRepo = require('./fixtures/npm.moduleInfo.repo.json');
            return Q.resolve(npmToGithubRepo[module]);
        },
        getModulesByUser: function(username){
            return Q.resolve(require('./fixtures/npm.getModulesByUser.dylang.json'));
        }
    },
    './github': {
        getStars: function(repo) {
            return Q.resolve(10);
        }
    },
    './download-count': {
        getDownloadCountForModule: function(repo) {
            return Q.resolve(10);
        }
    }
});

describe('anthology', function(){

    describe('e2e', function(){

        it('can use a username to get modules and number of stars', function(done){
            anthology.forUser('dylang', ['grunt-*', '!*cat*'])
                .then(function(data){
                    expect(data).to.be.an.array;
                    expect(data).to.have.length.above(1);
                })
                .catch(function(err){
                    expect(err).to.be.undefined;
                    throw err;
                })
                .fin(done);
        });
    });
});

