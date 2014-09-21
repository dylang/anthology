'use strict';

var Q = require('q');
var GitHubApi = require('github');
var github = new GitHubApi({
    version: "3.0.0"
});
github.authenticate({
    type: 'oauth',
    token: 'd8442f091c7b02ad3da9421a1c63029defe107e9'
});

function getRepo(repo) {

    if (!repo) {
        return 0;
    }

    var repoArray = repo.split('/');

    return Q.nfcall(github.repos.get, {user: repoArray[0], repo: repoArray[1] });
}

function getData(repo) {
    return Q.fcall(getRepo, repo)
        .then(function(data){
            //console.log('repo stars', repo, data.watchers_count);
            //console.log(repo, repo == 'isaacs/npmconf');
            if (repo == 'isaacs/npmconf') {
                console.log(data);
            }
            data.stars = data.stars || data.watchers_count;
            return Q.resolve(data);
        })
        .catch(function(err){
            console.log('err', repo, err.message);
            return Q.resolve({});
        });
}

module.exports = {
    getData: getData
};
