'use strict';
var expect = require('chai').expect;
var Q = require('q');

var proxyquire = require('proxyquire');
var npm = proxyquire('../lib/npm.js', {
    request: function(options, cb){
        if (options.url.match(/dylang/)) {
            cb(null, null, require('./fixtures/registry.browseAuthors.dylang.json'));
        }

        if (options.url.match(/grunt-notify/)) {
            cb(null, null, require('./fixtures/registry.module.grunt-notify.json'));
        }
    }
});

describe('npm', function(){

    describe('package', function(){

        it('can look up a package name and get author', function(done){
            Q.invoke(npm, 'userFromModuleName', 'grunt-notify')
                .then(function(username){
                    expect(username).to.equal('dylang');
                })
                .catch(function(err){
                    throw err;
                })
                .fin(done);
        });

        it('can look up a package name and get the github url', function(done){
            Q.invoke(npm, 'githubRepoFromModuleName', 'grunt-notify')
                .then(function(repo){
                    expect(repo).to.equal('dylang/grunt-notify');
                })
                .catch(function(err){
                    throw err;
                })
                .fin(done);
        });

        it('can gets an error when a module name is not passed in', function(done){
            Q.invoke(npm.userFromModuleName)
                .then(function(){
                    throw 'Should not make it here';
                })
                .catch(function(err){
                    expect(err).to.be.an.error;
                })
                .fin(done);
        });


    });

    describe('author', function(){
        it('can look up an author and get back module names sorted by newest first', function(done){
            Q.invoke(npm, 'getModulesByUser', 'dylang')
                .then(function(modules){
                    expect(modules).to.be.an.array;
                    expect(modules).to.have.length(13);
                    expect(modules[0].name).to.equal('changelog');
                })
                .catch(function(err){
                    throw err;
                })
                .fin(done);
        });

        it('gets an error when username is not provided', function(done){
            Q.invoke(npm, 'getModulesByUser')
                .then(function(modules){
                    throw new Error('Should not make it here');
                })
                .catch(function(err){
                    expect(err).to.be.an.error;
                })
                .fin(done);
        });

    });

});