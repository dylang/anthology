'use strict';

var anthology = require('./anthology');
var npmUsername = require('./npm-username');
var q = require('q');
var asciitable = require('asciitable');
var argv = require('optimist').argv;
var options = {
  skinny: true,
  intersectionCharacter: "+",
  columns: [
    {field: 'name', name: "Module"},
    {field: 'downloads',  name: "Downloads"},
    {field: 'stars',  name: "Stars"},
    {field: 'days',  name: "Age"},
      {field: 'popularity', 'name' : 'popularity'}
    //{field: 'description',  name: "Description"},
  ]
};

var username = argv._ && argv._[0] || 'dylang';

function getUsername() {
    if (argv._ && argv._[0]) {
        return q.resolve(argv._[0]);
    }
    return npmUsername.getUsername();
}

var getData = getUsername()
    .then(function(username){
        return anthology.getModuleStarsForUsername(username, ['*']);
    });



function sumStars(data) {
    return data.reduce(function(previous, data){
        return (previous.stars || previous) + data.stars;
    });
}

function sumDownloads(data) {
    return data.reduce(function(previous, data){
        return (previous.downloads || previous) + data.downloads;
    });
}

getData
    .then(function(data){
        data.push(
            {},
            { name: 'modules: ' + data.length },
            { name: 'downloads: ' + sumDownloads(data) },
            { name: 'stars: ' + sumStars(data) }
        );
        var table = asciitable(options, data);
        console.log(table);
    })
    .catch(function(err){
        console.log('uncaught error', err, err.stack);
    });




