'use strict';
var expect = require('chai').expect;
var Q = require('q');

var proxyquire = require('proxyquire');

function MockGithub() {
}

MockGithub.prototype.repos = {
    get: function(options, cb){
        cb(null, null, require('./fixtures/github.grunt-notify.json'));
    }
};

MockGithub.prototype.authenticate = function() {};

var github = proxyquire('../lib/github.js', { github: MockGithub });

describe('github', function(){

    describe('repo', function(){

        it('can look up a repo and get the number of stars', function(done){
            Q.invoke(github, 'getStars', 'dylang/grunt-notify')
                .then(function(stars){
                    expect(stars).to.equal(277);
                })
                .catch(function(err){
                    throw err;
                })
                .fin(done);
        });

        it('if the repo is not provided an error comes back', function(done){
            Q.invoke(github, 'getStars')
                .then(function(){
                    throw new Error('This should not be possible');
                })
                .catch(function(err){
                    expect(err).to.be.an.error;
                })
                .fin(done);
        });
    });
});